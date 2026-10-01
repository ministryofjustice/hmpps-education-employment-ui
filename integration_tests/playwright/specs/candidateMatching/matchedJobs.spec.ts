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
import { matchedJobsFilters } from '../../../mockData/matchedJobsFilterData'
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
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDefault)
  })

  test('Matched jobs tab - check content', async ({ page }) => {
    await jobApi.getJob('1')
    await jobApi.getMatchedJobs(matchedJobsFilters.filterReleaseAreaEmpty)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDistance50)

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

    // Verify table data
    const rows = await matchedJobsPage.tableData()
    expect(rows).toHaveLength(9)
    expect(rows[0].jobRole).toContain('Forklift operator')
    expect(rows[0].jobRole).toContain('Amazon')
    expect(rows[0].jobRole).toContain('Prisoner choice')
    expect(rows[0].typeOfWork).toContain('Animal care and farming')
    expect(rows[0].location).toContain('LS23 3JF')
    expect(rows[0].location).toContain('4.1 miles')
    expect(rows[0].closingDate).toContain('03 Jun 2024')

    // Follow links to job details page
    await matchedJobsPage.jobLink1().click()
    const jobDetailsPage = await JobDetailsPage.verifyOnPage(page, 'Warehouse operator')
    await jobDetailsPage.backLinkUrl().click()
    await expect(page).toHaveURL('/mjma/G6115VK/jobs/matched')

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
    await jobApi.getMatchedJobs(matchedJobsFilters.filterSectorConstruction)

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilter1().click()
    await matchedJobsPage.applyButton().click()
    await expect(matchedJobsPage.noResultsHeader()).toBeVisible()

    // Clear filters - verify filters are reset to defaults and correct results returned
    await matchedJobsPage.clearFiltersButton().click()
    await expectDefaultFilters(matchedJobsPage)
    await expect(matchedJobsPage.noResultsHeader()).not.toBeVisible()

    const rows = await matchedJobsPage.tableData()
    expect(rows).toHaveLength(5)
    expect(rows[0].jobRole).toContain('Forklift operator')
    expect(rows[0].jobRole).toContain('Amazon')
    expect(rows[0].jobRole).toContain('Prisoner choice')
    expect(rows[0].typeOfWork).toContain('Animal care and farming')
    expect(rows[0].location).toContain('LS23 3JF')
    expect(rows[0].location).toContain('4.1 miles')
    expect(rows[0].closingDate).toContain('03 Jun 2024')
  })

  test('Matched jobs tab - search radius filters', async ({ page }) => {
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDistanceNoRestriction)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDistance20)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDistance10)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDistance5)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDistance1)
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Filter by search radius = No restrictions
    await matchedJobsPage.distanceFilter().selectOption('0')
    await matchedJobsPage.applyButton().click()
    await expect(matchedJobsPage.resultsCounter()).toContainText('11 results')

    // Filter by search radius = 20 miles
    await matchedJobsPage.distanceFilter().selectOption('20')
    await matchedJobsPage.applyButton().click()
    await expect(matchedJobsPage.resultsCounter()).toContainText('6 results')

    // Filter by search radius = 10 miles
    await matchedJobsPage.distanceFilter().selectOption('10')
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(5)

    // Filter by search radius = 5 miles
    await matchedJobsPage.distanceFilter().selectOption('5')
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(4)

    // Filter by search radius = 1 mile
    await matchedJobsPage.distanceFilter().selectOption('1')
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(1)
  })

  test('Matched jobs tab - other types of work selected count updates', async ({ page }) => {
    await jobApi.getMatchedJobs(matchedJobsFilters.filterOtherTypesOfWorkCleaning)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterOtherTypesOfWorkCleaningAndOffencesArsonAndDriving)

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilterOther1().click()
    await matchedJobsPage.applyButton().click()

    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.jobSectorsFilterOtherSelectedCount()).toContainText('1 selected')
    await expect(matchedJobsPage.jobSectorFilterOther1()).toBeChecked()

    await matchedJobsPage.offenceFilterSectionToggle().click()
    await matchedJobsPage.offenceFilter1().click()
    await matchedJobsPage.offenceFilter2().click()
    await matchedJobsPage.applyButton().click()

    await expect(matchedJobsPage.offenceFilterSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.offenceFilterSelectedCount()).toContainText('2 selected')
  })

  test('Matched jobs tab - offence exclusions selected count updates', async ({ page }) => {
    await jobApi.getMatchedJobs(matchedJobsFilters.filterOffenceFilterArsonAndDriving)

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.offenceFilterSectionToggle().click()
    await matchedJobsPage.offenceFilter1().click()
    await matchedJobsPage.offenceFilter2().click()
    await matchedJobsPage.applyButton().click()

    await expect(matchedJobsPage.offenceFilterSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.offenceFilterSelectedCount()).toContainText('2 selected')
  })

  test('Matched jobs tab - sorting columns', async ({ page }) => {
    await jobApi.getMatchedJobs(matchedJobsFilters.filterDistance50)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterSortByJobTitleAsc)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterSortByJobTitleDesc)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterSortByDistanceAsc)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterSortByDistanceDesc)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterSortByClosingDateAsc)
    await jobApi.getMatchedJobs(matchedJobsFilters.filterSortByClosingDateDesc)

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    const defaultRows = await matchedJobsPage.tableData()
    expect(defaultRows.length).toBeGreaterThan(0)

    // Sort by jobRole asc
    await matchedJobsPage.jobRoleColumnToggle().click()
    await expect(page).toHaveURL(/sort=jobTitle&order=ascending/)
    const rowsByJobRoleAsc = await matchedJobsPage.tableData()
    expect(rowsByJobRoleAsc).toHaveLength(9)
    expect(rowsByJobRoleAsc[0].jobRole).toContain('Barista')
    expect(rowsByJobRoleAsc[0].jobRole).toContain('Starbucks')
    expect(rowsByJobRoleAsc[0].jobRole).toContain('Prisoner choice')
    expect(rowsByJobRoleAsc[0].typeOfWork).toContain('Hospitality and catering')
    expect(rowsByJobRoleAsc[0].location).toContain('SW1A 1AA')
    expect(rowsByJobRoleAsc[0].location).toContain('1.8 miles')
    expect(rowsByJobRoleAsc[0].closingDate).toContain('03 Jun 2024')

    // Sort by jobRole desc
    await matchedJobsPage.jobRoleColumnToggle().click()
    await expect(page).toHaveURL(/sort=jobTitle&order=descending/)
    const rowsByJobRoleDesc = await matchedJobsPage.tableData()
    expect(rowsByJobRoleDesc).toHaveLength(9)
    expect(rowsByJobRoleDesc[0].jobRole).toContain('Retail Assistant')
    expect(rowsByJobRoleDesc[0].jobRole).toContain('Primark')
    expect(rowsByJobRoleDesc[0].typeOfWork).toContain('Retail and sales')
    expect(rowsByJobRoleDesc[0].location).toContain('M1 1AA')
    expect(rowsByJobRoleDesc[0].location).toContain('1.2 miles')
    expect(rowsByJobRoleDesc[0].closingDate).toContain('03 Jun 2024')

    // Sort by distance asc
    await matchedJobsPage.jobLocationColumnToggle().click()
    await expect(page).toHaveURL(/sort=distance&order=ascending/)
    const rowsByDistanceAsc = await matchedJobsPage.tableData()
    expect(rowsByDistanceAsc).toHaveLength(9)
    expect(rowsByDistanceAsc[0].jobRole).toContain('Retail Assistant')
    expect(rowsByDistanceAsc[0].jobRole).toContain('Primark')
    expect(rowsByDistanceAsc[0].typeOfWork).toContain('Retail and sales')
    expect(rowsByDistanceAsc[0].location).toContain('M1 1AA')
    expect(rowsByDistanceAsc[0].location).toContain('1.2 miles')
    expect(rowsByDistanceAsc[0].closingDate).toContain('03 Jun 2024')

    // Sort by distance desc
    await matchedJobsPage.jobLocationColumnToggle().click()
    await expect(page).toHaveURL(/sort=distance&order=descending/)
    const rowsByDistanceDesc = await matchedJobsPage.tableData()
    expect(rowsByDistanceDesc).toHaveLength(9)
    expect(rowsByDistanceDesc[0].jobRole).toContain('Cashier')
    expect(rowsByDistanceDesc[0].jobRole).toContain('Walmart')
    expect(rowsByDistanceDesc[0].typeOfWork).toContain('Retail and sales')
    expect(rowsByDistanceDesc[0].location).toContain('M12 6LP')
    expect(rowsByDistanceDesc[0].location).toContain('6.5 miles')
    expect(rowsByDistanceDesc[0].closingDate).toContain('03 Jun 2024')

    // Sort by closing date asc
    await matchedJobsPage.closingDateColumnToggle().click()
    await expect(page).toHaveURL(/sort=closingDate&order=ascending/)
    const rowsByClosingDateAsc = await matchedJobsPage.tableData()
    expect(rowsByClosingDateAsc).toHaveLength(9)
    expect(rowsByClosingDateAsc[0].jobRole).toContain('Kitchen Staff')
    expect(rowsByClosingDateAsc[0].jobRole).toContain('Burger King')
    expect(rowsByClosingDateAsc[0].typeOfWork).toContain('Hospitality and catering')
    expect(rowsByClosingDateAsc[0].location).toContain('G1 1AA')
    expect(rowsByClosingDateAsc[0].location).toContain('5.7 miles')
    expect(rowsByClosingDateAsc[0].closingDate).toContain('02 Jun 2024')

    // Sort by closing date desc
    await matchedJobsPage.closingDateColumnToggle().click()
    await expect(page).toHaveURL(/sort=closingDate&order=descending/)
    const rowsByClosingDateDesc = await matchedJobsPage.tableData()
    expect(rowsByClosingDateDesc).toHaveLength(9)
    expect(rowsByClosingDateDesc[0].jobRole).toContain('Delivery Driver')
    expect(rowsByClosingDateDesc[0].jobRole).toContain('Pizza Hut')
    expect(rowsByClosingDateDesc[0].typeOfWork).toContain('Driving and transport')
    expect(rowsByClosingDateDesc[0].location).toContain('BS1 1AB')
    expect(rowsByClosingDateDesc[0].location).toContain('3.5 miles')
    expect(rowsByClosingDateDesc[0].closingDate).toContain('03 Jul 2024')
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
