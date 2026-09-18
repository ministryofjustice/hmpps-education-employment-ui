import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../../testUtils'
import NationalJobsPage from '../../pages/candidateMatching/nationalJobs'

import manageUsersApi from '../../../mockApis/manageUsersApi'
import nomisUserRolesApi from '../../../mockApis/nomisUserRolesApi'
import jobApi from '../../../mockApis/jobApi'
import prisonerSearchApi from '../../../mockApis/prisonerSearchApi'
import esweProfileApi from '../../../mockApis/esweProfileApi'
import deliusIntegrationApi from '../../../mockApis/deliusIntegrationApi'
import config from '../../../../server/config'
import {
  defaultNationalJobsResponse,
  emptyNationalJobsResponse,
  offenceExclusionNationalJobsResponse,
  stubNationalJobs,
} from '../../../mockData/nationalJobsFilterData'

test.describe('National Jobs Tab', () => {
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
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await stubNationalJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&isNationalJob=true',
      defaultNationalJobsResponse,
    )
    await stubNationalJobs(
      'page=0&size=20&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&isNationalJob=true',
      defaultNationalJobsResponse,
    )
    await stubNationalJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&prisonNumber=G6115VK&isNationalJob=true',
      emptyNationalJobsResponse,
    )
    await stubNationalJobs(
      'page=0&size=20&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&isNationalJob=true&offenceExclusions=ARSON%2CDRIVING',
      offenceExclusionNationalJobsResponse,
    )
    await jobApi.getEmployersWithNationalJobs()
  })

  test('National jobs tab - check content', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await expect(nationalJobsPage.employerFilter()).toHaveValue('')
    await expect(nationalJobsPage.jobSectorFilter1()).not.toBeChecked()
    await expect(nationalJobsPage.jobSectorFilter2()).not.toBeChecked()
    await expect(nationalJobsPage.jobSectorFilterOther1()).not.toBeChecked()
    await expect(nationalJobsPage.jobSectorFilterOther2()).not.toBeChecked()
    await expect(nationalJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(nationalJobsPage.offenceFilterSection()).not.toHaveAttribute('open')

    await expect(page.getByText('0 results')).toBeVisible()
  })

  test('National jobs tab - no results', async ({ page }) => {
    await stubNationalJobs(
      'page=0&size=20&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&isNationalJob=true&offenceExclusions=ARSON%2CDRIVING',
      emptyNationalJobsResponse,
    )

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.offenceFilterSectionToggle().click()
    await nationalJobsPage.offenceFilter1().click()
    await nationalJobsPage.offenceFilter2().click()
    await nationalJobsPage.applyButton().click()

    await expect(page.getByText('0 results')).toBeVisible()
    await expect(page.getByText('remove offence exclusions')).toBeVisible()
  })

  test('National jobs tab - employer filter updates results', async ({ page }) => {
    const employerId = '019a15bc-2444-711d-83c0-892a1d9a57c0'
    await stubNationalJobs(
      `page=0&size=20&prisonNumber=G6115VK&isNationalJob=true&employerId=${employerId}`,
      emptyNationalJobsResponse,
    )

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.employerFilter().selectOption(employerId)
    await nationalJobsPage.applyButton().click()

    await expect(page.getByText('0 results')).toBeVisible()
  })

  test('National jobs tab - other types of work selected count updates', async ({ page }) => {
    const otherSector = 'CLEANING_AND_MAINTENANCE'
    await stubNationalJobs(
      `page=0&size=20&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL%2C${otherSector}&prisonNumber=G6115VK&isNationalJob=true`,
      defaultNationalJobsResponse,
    )

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await nationalJobsPage.jobSectorFilterOther1().click()
    await nationalJobsPage.applyButton().click()

    await expect(nationalJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(nationalJobsPage.jobSectorsFilterOtherSelectedCount()).toContainText('1 selected')
  })

  test('National jobs tab - offence exclusions selected count updates', async ({ page }) => {
    await stubNationalJobs(
      'page=0&size=20&prisonNumber=G6115VK&isNationalJob=true&offenceExclusions=ARSON%2CDRIVING',
      emptyNationalJobsResponse,
    )

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.offenceFilterSectionToggle().click()
    await nationalJobsPage.offenceFilter1().click()
    await nationalJobsPage.offenceFilter2().click()
    await nationalJobsPage.applyButton().click()

    await expect(page.getByText('0 results')).toBeVisible()
    await expect(nationalJobsPage.offenceFilterSection()).not.toHaveAttribute('open')
    await expect(nationalJobsPage.offenceFilterSelectedCount()).toContainText('2 selected')
  })
})
