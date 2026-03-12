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
  // Only run tests if the offence exclusions feature flag is set to True
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

    // Verify count of results
    await expect(matchedJobsPage.resultsCounter()).toContainText('9 results')

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
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=CONSTRUCTION&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // Change filter to return no jobs - verify result message
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
    await jobApi.getMatchedJobs('page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&isNationalJob=false')
    await jobApi.getMatchedJobs(
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=20&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=10&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=5&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=1&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Filter by search radius = No restrictions
    await matchedJobsPage.distanceFilter().selectOption('0')
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(11)

    // Filter by search radius = 20 miles
    await matchedJobsPage.distanceFilter().selectOption('20')
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(6)

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

  test('Matched jobs tab - job sector filters', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=OUTDOOR&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=OUTDOOR%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=CLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Filter by type of work = Animal care and farming
    await matchedJobsPage.jobSectorFilter2().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(1)

    // Filter by type of work = Animal care and farming, and other type of work = Cleaning and maintenance
    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilterOther1().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(2)
    // Check 'Other types of work' filter section is collapsed after applying filters, and displays the correct
    // number of selected options.
    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.jobSectorsFilterOtherSelectedCount()).toBeVisible()
    await expect(matchedJobsPage.jobSectorsFilterOtherSelectedCount()).toContainText('1 selected')

    // Filter by other type of work = Cleaning and maintenance
    await matchedJobsPage.jobSectorFilter2().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(1)
    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.jobSectorsFilterOtherSelectedCount()).toBeVisible()
    await expect(matchedJobsPage.jobSectorsFilterOtherSelectedCount()).toContainText('1 selected')

    // Remove all job sector filters
    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilterOther1().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(9)
    await expect(matchedJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.jobSectorsFilterOtherSelectedCount()).not.toBeVisible()
  })

  test('Matched jobs tab - offence exclusions filters', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false&offenceExclusions=ARSON%2CDRIVING',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.offenceFilterSectionToggle().click()
    await matchedJobsPage.offenceFilter1().click()
    await matchedJobsPage.offenceFilter2().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(8)

    // Check 'Offence exclusions' filter section is collapsed after applying filters, and displays the correct number of selected options.
    await expect(matchedJobsPage.offenceFilterSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.offenceFilterSelectedCount()).toBeVisible()
    await expect(matchedJobsPage.offenceFilterSelectedCount()).toContainText('2 selected')

    // Remove all offence exclusions filters
    await matchedJobsPage.offenceFilterSectionToggle().click()
    await matchedJobsPage.offenceFilter1().click()
    await matchedJobsPage.offenceFilter2().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(9)
    await expect(matchedJobsPage.offenceFilterSection()).not.toHaveAttribute('open')
    await expect(matchedJobsPage.offenceFilterSelectedCount()).not.toBeVisible()
  })

  test('Matched jobs tab - no release area postcode', async ({ page }) => {
    await jobApi.getMatchedJobs('page=0&size=20&prisonNumber=G6115VK&isNationalJob=false')

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    await matchedJobsPage.locationFilter().fill('')
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(8)
    // Expect distance filter to be automatically set to 'no restrictions' when no release area postcode is provided.
    expect(await matchedJobsPage.distanceFilter()).toHaveValue('0')
  })

  test('Matched jobs tab - filter combinations', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=OUTDOOR%2CRETAIL%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&isNationalJob=false&offenceExclusions=DRIVING',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=OUTDOOR%2CRETAIL%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=20&isNationalJob=false&offenceExclusions=DRIVING',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sectors=OUTDOOR%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=20&isNationalJob=false&offenceExclusions=DRIVING',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Search radius + types of work + other types of work + offence exclusions
    await matchedJobsPage.distanceFilter().selectOption('20')
    await matchedJobsPage.jobSectorFilter2().click()
    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilterOther1().click()
    await matchedJobsPage.offenceFilterSectionToggle().click()
    await matchedJobsPage.offenceFilter2().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(6)

    // Change a filter
    await matchedJobsPage.jobSectorFilter3().click()
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(7)

    // Remove postcode
    await matchedJobsPage.locationFilter().fill('')
    await matchedJobsPage.applyButton().click()
    expect(await matchedJobsPage.tableData()).toHaveLength(8)
    // Expect distance filter to be automatically set to 'no restrictions' when no release area postcode is provided.
    expect(await matchedJobsPage.distanceFilter()).toHaveValue('0')

    // Clear filters
    await matchedJobsPage.clearFiltersButton().click()
    await expectDefaultFilters(matchedJobsPage)
    expect(await matchedJobsPage.tableData()).toHaveLength(5)
  })

  test('Matched jobs tab - sorting columns', async ({ page }) => {
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=jobTitle&sortOrder=asc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=jobTitle&sortOrder=desc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=distance&sortOrder=asc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=distance&sortOrder=desc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )
    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=asc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await jobApi.getMatchedJobs(
      'page=0&size=20&sortBy=closingDate&sortOrder=desc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false',
    )

    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')

    // Verify default sorting (by closing date ascending)
    const rows = await matchedJobsPage.tableData()
    expect(rows).toHaveLength(9)
    expect(rows[0].jobRole).toContain('Forklift operator')
    expect(rows[0].jobRole).toContain('Amazon')
    expect(rows[0].jobRole).toContain('Prisoner choice')
    expect(rows[0].typeOfWork).toContain('Animal care and farming')
    expect(rows[0].location).toContain('LS23 3JF')
    expect(rows[0].location).toContain('4.1 miles')
    expect(rows[0].closingDate).toContain('03 Jun 2024')

    // Sort by job role asc
    await matchedJobsPage.jobRoleColumnToggle().click()
    const rowsByJobRoleAsc = await matchedJobsPage.tableData()
    expect(rowsByJobRoleAsc).toHaveLength(9)
    expect(rowsByJobRoleAsc[0].jobRole).toContain('Barista')
    expect(rowsByJobRoleAsc[0].jobRole).toContain('Starbucks')
    expect(rowsByJobRoleAsc[0].jobRole).toContain('Prisoner choice')
    expect(rowsByJobRoleAsc[0].typeOfWork).toContain('Hospitality and catering')
    expect(rowsByJobRoleAsc[0].location).toContain('SW1A 1AA')
    expect(rowsByJobRoleAsc[0].location).toContain('1.8 miles')
    expect(rowsByJobRoleAsc[0].closingDate).toContain('03 Jun 2024')

    // Sort by job role desc
    await matchedJobsPage.jobRoleColumnToggle().click()
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
