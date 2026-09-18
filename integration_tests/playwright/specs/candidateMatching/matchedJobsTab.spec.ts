import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../../testUtils'
import MatchedJobsPage from '../../pages/candidateMatching/matchedJobs'
import NationalJobsPage from '../../pages/candidateMatching/nationalJobs'
import ArchivedJobsPage from '../../pages/candidateMatching/archivedJobs'
import JobDetailsPage from '../../pages/candidateMatching/jobDetails'

import manageUsersApi from '../../../mockApis/manageUsersApi'
import nomisUserRolesApi from '../../../mockApis/nomisUserRolesApi'
import jobApi from '../../../mockApis/jobApi'
import prisonerSearchApi from '../../../mockApis/prisonerSearchApi'
import esweProfileApi from '../../../mockApis/esweProfileApi'
import deliusIntegrationApi from '../../../mockApis/deliusIntegrationApi'
import config from '../../../../server/config'

test.describe('Matched Jobs Tab', () => {
  const { offenceFilterEnabled } = config.featureToggles

  if (!offenceFilterEnabled) {
    test.skip()
  }

  test.afterEach(async () => {
    await resetStubs()
  })

  test.beforeEach(async ({ page }) => {
    await manageUsersApi.stubAuthUser()
    await nomisUserRolesApi.getUserActiveCaseLoad()
    await manageUsersApi.stubGetUser({ username: 'USER1', name: 'Joe Bloggs' })
    await login(page, {
      name: 'Joe Bloggs',
      roles: [
        'ROLE_EDUCATION_WORK_PLAN_EDITOR',
        'ROLE_EDUCATION_WORK_PLAN_VIEWER',
        'ROLE_WORK_READINESS_EDITOR',
        'ROLE_WORK_READINESS_VIEWER',
      ],
    })

    await prisonerSearchApi.getPrisonerByCaseLoadIdAndOffenderId('G6115VK')
    await prisonerSearchApi.getPrisonerById('G6115VK')
    await esweProfileApi.getProfileById('G6115VK')
    await deliusIntegrationApi.getPrisonerAddress('G6115VK')
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
  })

  test('Matched jobs tab - check content', async ({ page }) => {
    await jobApi.getJob('1')
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&isNationalJob=true',
    )
    await jobApi.getArchivedJobs()
    await jobApi.getEmployersWithNationalJobs()
    await jobApi.getEmployer('01907e1e-bb85-7bb7-9018-33a2070a367d')

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Verify default filter settings
    await expect(matchedJobsPage.locationFilter()).toHaveValue('L15 7LR')
    await expect(matchedJobsPage.distanceFilter()).toHaveValue('50')
    await expect(matchedJobsPage.jobSectorFilter1()).not.toBeChecked()
    await expect(matchedJobsPage.jobSectorFilter2()).not.toBeChecked()
    await expect(matchedJobsPage.jobSectorFilter3()).not.toBeChecked()
    await expect(matchedJobsPage.jobSectorFilterOther1()).not.toBeChecked()
    await expect(matchedJobsPage.jobSectorFilterOther2()).not.toBeChecked()

    // Verify filter sections are collapsed by default and can be expanded and collapsed
    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.offenceFilterSection()).not.toHaveAttribute('open')

    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).toHaveAttribute('open')
    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')

    await matchedJobsPage.offenceFilterSectionToggle().click()
    await expect(matchedJobsPage.offenceFilterSection()).toHaveAttribute('open')
    await matchedJobsPage.offenceFilterSectionToggle().click()
    await expect(matchedJobsPage.offenceFilterSection()).not.toHaveAttribute('open')

    // Follow links to other tabs
    await matchedJobsPage.nationalJobsTab().click()
    await expect(page).toHaveURL(
      '/mjma/G6115VK/jobs/national-jobs?sort=closingDate&order=ascending&jobSectorFilter=CONSTRUCTION,OUTDOOR,RETAIL',
    )
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')
    await nationalJobsPage.matchedJobsTab().click()
    await expect(page).toHaveURL(
      '/mjma/G6115VK/jobs/matched?sort=closingDate&order=ascending&jobSectorFilter=CONSTRUCTION,OUTDOOR,RETAIL',
    )

    await matchedJobsPage.archivedJobsTab().click()
    await expect(page).toHaveURL('/mjma/G6115VK/jobs/archived?sort=closingDate&order=ascending')
    const archivedJobsPage = await ArchivedJobsPage.verifyOnPage(page, 'Test User7')
    await archivedJobsPage.matchedJobsTab().click()
    await expect(page).toHaveURL(
      '/mjma/G6115VK/jobs/matched?sort=closingDate&order=ascending&jobSectorFilter=CONSTRUCTION,OUTDOOR,RETAIL',
    )

    // Print button - check that the print button triggers the print dialog (see https://playwright.dev/docs/dialogs#print-dialogs)
    await page.evaluate('(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()')
    await matchedJobsPage.printButton().click()
    await page.waitForFunction('window.waitForPrintDialog')
  })

  test('Matched jobs tab - no results', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=CONSTRUCTION&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilter1().click()
    await matchedJobsPage.applyButton().click()

    await expect(matchedJobsPage.noResultsHeader()).toBeVisible()
  })

  test('Matched jobs tab - search radius filters', async ({ page }) => {
    await jobApi.getMatchedJobs('page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&isNationalJob=false')
    await jobApi.getMatchedJobs(
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=20&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.distanceFilter().selectOption('0')
    await matchedJobsPage.applyButton().click()
    await expect(matchedJobsPage.resultsCounter()).toContainText('11 results')

    await matchedJobsPage.distanceFilter().selectOption('20')
    await matchedJobsPage.applyButton().click()
    await expect(matchedJobsPage.resultsCounter()).toContainText('6 results')
  })

  test('Matched jobs tab - other types of work selected count updates', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=OUTDOOR%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.jobSectorFilter1().click()
    await matchedJobsPage.jobSectorFilter3().click()
    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilterOther1().click()
    await matchedJobsPage.applyButton().click()

    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.jobSectorsFilterOtherSelectedCount()).toContainText('1 selected')
  })

  test('Matched jobs tab - offence exclusions selected count updates', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false&offenceExclusions=ARSON%2CDRIVING',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.offenceFilterSectionToggle().click()
    await matchedJobsPage.offenceFilter1().click()
    await matchedJobsPage.offenceFilter2().click()
    await matchedJobsPage.applyButton().click()

    await expect(matchedJobsPage.offenceFilterSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.offenceFilterSelectedCount()).toContainText('2 selected')
    await expect(matchedJobsPage.resultsCounter()).toContainText('8 results')
  })
})

// Utility function to check all filters are set to default values
async function expectDefaultFilters(matchedJobsPage: MatchedJobsPage) {
  await expect(matchedJobsPage.locationFilter()).toHaveValue('L15 7LR')
  await expect(matchedJobsPage.distanceFilter()).toHaveValue('50')
  await expect(matchedJobsPage.jobSectorFilter1()).toBeChecked()
  await expect(matchedJobsPage.jobSectorFilter2()).toBeChecked()
  await expect(matchedJobsPage.jobSectorFilter3()).toBeChecked()
  await expect(matchedJobsPage.jobSectorFilterOther1()).not.toBeChecked()
  await expect(matchedJobsPage.jobSectorFilterOther2()).not.toBeChecked()
}
