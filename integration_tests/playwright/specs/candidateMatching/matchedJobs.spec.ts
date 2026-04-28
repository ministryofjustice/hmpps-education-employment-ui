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

test.describe('Matched Jobs Tab', () => {
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
  })

  test('Matched jobs tab - check content', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Verify default filter settings
    await expect(matchedJobsPage.locationFilter()).toHaveValue('L15 7LR')
    await expect(matchedJobsPage.distanceFilter()).toHaveValue('50')
    await expect(matchedJobsPage.jobSectorFilter1()).not.toBeChecked()
    await expect(matchedJobsPage.jobSectorFilter2()).not.toBeChecked()
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

    // Verify table data
    const rows = await matchedJobsPage.tableData()
    expect(rows).toHaveLength(11)
    expect(rows[0].jobRole).toContain('Forklift operator')
    expect(rows[0].jobRole).toContain('Amazon')
    expect(rows[0].jobRole).toContain('Prisoner choice')
    expect(rows[0].typeOfWork).toContain('Animal care and farming')
    expect(rows[0].location).toContain('LS23 3JF')
    expect(rows[0].location).toContain('4.1 miles')
    expect(rows[0].closingDate).toContain('03 Jun 2024')

    // Verify count of results
    await expect(matchedJobsPage.resultsCounter()).toContainText('11 results')

    // Follow links to job details page
    await matchedJobsPage.jobLink1().click()
    const jobDetailsPage = await JobDetailsPage.verifyOnPage(page, '')

    // Follow links to other tabs
    await matchedJobsPage.nationalJobsTab().click()
    await expect(page).toHaveURL('/mjma/G6115VK/jobs/matched/national')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')
    await nationalJobsPage.matchedJobsTab().click()
    await expect(page).toHaveURL('/mjma/G6115VK/jobs/matched')

    await matchedJobsPage.archivedJobsTab().click()
    await expect(page).toHaveURL('/mjma/G6115VK/jobs/matched/archived')
    const archivedJobsPage = await ArchivedJobsPage.verifyOnPage(page, 'Test User7')
    await archivedJobsPage.matchedJobsTab().click()
    await expect(page).toHaveURL('/mjma/G6115VK/jobs/matched')

    // Print button
  })

  test('Matched jobs tab - no results', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=CONSTRUCTION&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // Change filter to return no jobs - verify results message
    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilter1().click()
    await matchedJobsPage.applyButton().click()
    await expect(matchedJobsPage.noResultsHeader()).toBeVisible()

    // Clear filters - verify results returned
    // TODO
  })

  test('Matched jobs tab - search radius filters', async ({ page }) => {
    // await jobApi.getMatchedJobs(
    //   'page=0&size=20&sectors=CONSTRUCTION&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    // )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Filter by search radius = No restrictions
    await matchedJobsPage.distanceFilter().selectOption('0')
    await matchedJobsPage.applyButton().click()
    const rows = await matchedJobsPage.tableData()
    expect(rows).toHaveLength(11)
    expect(rows[0].jobRole).toContain('Forklift operator')
    expect(rows[0].jobRole).toContain('Amazon')
    expect(rows[0].jobRole).toContain('Prisoner choice')
    expect(rows[0].typeOfWork).toContain('Animal care and farming')
    expect(rows[0].location).toContain('LS23 3JF')
    expect(rows[0].location).toContain('4.1 miles')
    expect(rows[0].closingDate).toContain('03 Jun 2024')

    // Filter by search radius = 20 miles
    // TODO
    // Filter by search radius = 10 miles
    // TODO
    // Filter by search radius = 5 miles
    // TODO
    // Filter by search radius = 1 mile
  })

  test('Matched jobs tab - job sector filters', async ({ page }) => {
    // await jobApi.getMatchedJobs(
    //   'page=0&size=20&sectors=CONSTRUCTION&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    // )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Filter by type of work = Animal care and farming
    // TODO
    // Filter by type of work = Animal care and farming, and other type of work = Cleaning and maintenance
    // TODO
    // (check count of selected is correct, and section is collapsed)
    // Filter by other type of work = Cleaning and maintenance
    // TODO
    // Remove all job sector filters
    // TODO
  })

  test('Matched jobs tab - offence exclusions filters', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // TODO
    // (check count of selected is correct, and section is collapsed)
  })

  test('Matched jobs tab - no release area postcode', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // TODO
  })

  test('Matched jobs tab - non-verifiable release area postcode', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // TODO
  })

  test('Matched jobs tab - filter combinations', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // TODO

    // Search radius + types of work + other types of work + offence exclusions

    // Change a filter

    // Remove postcode

    // Clear filters
  })

  test('Matched jobs tab - sorting columns', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // TODO
  })
})
