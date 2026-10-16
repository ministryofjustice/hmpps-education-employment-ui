import { expect, test } from '../../fixtures/featureToggles'

import { resetStubs } from '../../testUtils'
import NationalJobsPage from '../../pages/candidateMatching/nationalJobs'

import jobApi from '../../../mockApis/jobApi'
import prisonerSearchApi from '../../../mockApis/prisonerSearchApi'
import esweProfileApi from '../../../mockApis/esweProfileApi'
import deliusIntegrationApi from '../../../mockApis/deliusIntegrationApi'
import {
  defaultNationalJobsResponse,
  employerFilterNationalJobsResponse,
  emptyNationalJobsResponse,
  nationalJobsCleaningAndArsonResponse,
  nationalJobsQueries,
  offenceExclusionNationalJobsResponse,
  stubNationalJobs,
} from '../../../mockData/nationalJobsFilterData'
import JobDetailsPage from '../../pages/candidateMatching/jobDetails'

test.describe('National Jobs Tab', () => {
  test.use({ offenceFilterEnabled: true, nationalJobsEnabled: true })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.beforeEach(async ({ page: _page }) => {
    await prisonerSearchApi.getPrisonerByCaseLoadIdAndOffenderId('G6115VK')
    await prisonerSearchApi.getPrisonerById('G6115VK')
    await esweProfileApi.getProfileById('G6115VK')
    await deliusIntegrationApi.getPrisonerAddress('G6115VK')
    await jobApi.getMatchedJobs(nationalJobsQueries.matchedJobsDefault)
    await stubNationalJobs(nationalJobsQueries.nationalJobsDefaultSorted, defaultNationalJobsResponse)
    await stubNationalJobs(nationalJobsQueries.nationalJobsDefault, defaultNationalJobsResponse)
    await stubNationalJobs(nationalJobsQueries.nationalJobsNoResultsSorted, emptyNationalJobsResponse)
    await stubNationalJobs(nationalJobsQueries.nationalJobsOffenceExclusions, offenceExclusionNationalJobsResponse)
    await stubNationalJobs(nationalJobsQueries.nationalJobsCleaningAndArson, emptyNationalJobsResponse)
    await stubNationalJobs(
      nationalJobsQueries.nationalJobsOutdoorAndWarehousingWithOffenceExclusions,
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

    // Verify filter sections are collapsed by default and can be expanded and collapsed
    await expect(nationalJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(nationalJobsPage.offenceFilterSection()).not.toHaveAttribute('open')

    await nationalJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await expect(nationalJobsPage.jobSectorsFilterOtherSection()).toHaveAttribute('open')
    await nationalJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await expect(nationalJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')

    await nationalJobsPage.offenceFilterSectionToggle().click()
    await expect(nationalJobsPage.offenceFilterSection()).toHaveAttribute('open')
    await nationalJobsPage.offenceFilterSectionToggle().click()
    await expect(nationalJobsPage.offenceFilterSection()).not.toHaveAttribute('open')

    await expect(page.getByText('0 results')).toBeVisible()
  })

  test('National jobs tab - follow links to job details page and return to correct filters', async ({ page }) => {
    await stubNationalJobs(nationalJobsQueries.nationalJobsOffenceExclusions, offenceExclusionNationalJobsResponse)
    await jobApi.getNationalJob('1')
    await jobApi.getEmployer('01907e1e-bb85-7bb7-9018-33a2070a367d')

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.jobSectorFilter2().click()
    await nationalJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await page.getByRole('checkbox', { name: 'Warehousing and storage', exact: true }).check()

    await nationalJobsPage.offenceFilterSectionToggle().click()
    await nationalJobsPage.offenceFilter1().click()
    await nationalJobsPage.offenceFilter2().click()
    await nationalJobsPage.applyButton().click()

    const rows = await nationalJobsPage.tableData()
    expect(rows).toHaveLength(2)
    expect(rows[0].jobRole).toContain('National warehouse operator')
    expect(rows[0].jobRole).toContain('ASDA')
    expect(rows[0].typeOfWork).toContain('Warehousing and storage')

    await nationalJobsPage.jobLink1().click()
    const jobDetailsPage = await JobDetailsPage.verifyOnPage(page, 'National Warehouse operator')

    await jobDetailsPage.backLinkUrl().click()
    await expect(page).toHaveURL(
      '/mjma/G6115VK/jobs/national-jobs?jobSectorFilter=OUTDOOR&jobSectorFilterOther=WAREHOUSING&offenceFilter=ARSON,DRIVING',
    )

    await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await expect(nationalJobsPage.jobSectorFilter2()).toBeChecked()
    await expect(
      page.getByRole('checkbox', { name: 'Warehousing and storage', exact: true, includeHidden: true }),
    ).toBeChecked()
    await expect(nationalJobsPage.offenceFilter1()).toBeChecked()
    await expect(nationalJobsPage.offenceFilter2()).toBeChecked()

    expect(await nationalJobsPage.tableData()).toEqual(rows)
  })

  test('National jobs tab - no results when offence filters applied', async ({ page }) => {
    await stubNationalJobs(nationalJobsQueries.nationalJobsOffenceExclusions, emptyNationalJobsResponse)

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.offenceFilterSectionToggle().click()
    await nationalJobsPage.offenceFilter1().click()
    await nationalJobsPage.offenceFilter2().click()
    await nationalJobsPage.applyButton().click()

    await expect(page.getByText('0 results')).toBeVisible()
    await expect(page.getByText('remove offence exclusions')).toBeVisible()
  })

  test('National jobs tab - no results without filters applied', async ({ page }) => {
    await stubNationalJobs(nationalJobsQueries.nationalJobsNoFilters, emptyNationalJobsResponse)

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    await NationalJobsPage.verifyOnPage(page, 'Test User7')
    await expect(page.getByText('0 results')).toBeVisible()
  })

  test('National jobs tab - employer filter updates results no matching jobs', async ({ page }) => {
    const employerId = '019a15bc-2444-711d-83c0-892a1d9a57c0'
    await stubNationalJobs(nationalJobsQueries.nationalJobsEmployerFilter(employerId), emptyNationalJobsResponse)

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.employerFilter().selectOption(employerId)
    await nationalJobsPage.applyButton().click()

    await expect(page.getByText('0 results')).toBeVisible()
  })

  test('National jobs tab - employer filter updates results matching jobs found', async ({ page }) => {
    const employerId = '019a15bc-2444-711d-83c0-892a1d9a57c0'
    await stubNationalJobs(
      nationalJobsQueries.nationalJobsEmployerFilter(employerId),
      employerFilterNationalJobsResponse,
    )
    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.employerFilter().selectOption(employerId)
    await nationalJobsPage.applyButton().click()

    await expect(nationalJobsPage.resultsCounter()).toHaveText('1 result')
    await expect(nationalJobsPage.employerFilter().locator('option:checked')).toHaveText('ABC Construction 10')

    const rows = await nationalJobsPage.tableData()
    expect(rows).toHaveLength(1)
    expect(rows[0].jobRole).toContain('Builder')
    expect(rows[0].jobRole).toContain('ABC Construction 10')
    expect(rows[0].typeOfWork).toContain('Construction and trade')
  })

  test('National jobs tab - other types of work selected count updates', async ({ page }) => {
    const otherSector = 'CLEANING_AND_MAINTENANCE'
    await stubNationalJobs(nationalJobsQueries.nationalJobsOtherTypeOfWork(otherSector), defaultNationalJobsResponse)

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await nationalJobsPage.jobSectorFilterOther1().click()
    await nationalJobsPage.applyButton().click()

    await expect(nationalJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(nationalJobsPage.jobSectorsFilterOtherSelectedCount()).toContainText('1 selected')
  })

  test('National jobs tab - offence exclusions selected count updates', async ({ page }) => {
    await stubNationalJobs(nationalJobsQueries.nationalJobsOffenceOnly, emptyNationalJobsResponse)

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

  test('National jobs tab - clear filters resets all filters', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await nationalJobsPage.jobSectorFilterOther1().click()

    await nationalJobsPage.offenceFilterSectionToggle().click()
    await nationalJobsPage.offenceFilter1().click()

    await nationalJobsPage.applyButton().click()
    await expect(nationalJobsPage.jobSectorFilterOther1()).toBeChecked()
    await expect(nationalJobsPage.offenceFilter1()).toBeChecked()

    await nationalJobsPage.clearFiltersButton().click()

    await expect(nationalJobsPage.jobSectorFilter1()).toBeChecked()
    await expect(nationalJobsPage.jobSectorFilter2()).toBeChecked()
    await expect(nationalJobsPage.jobSectorFilter3()).toBeChecked()
    await expect(nationalJobsPage.jobSectorFilterOther1()).not.toBeChecked()
    await expect(nationalJobsPage.jobSectorsFilterOtherSection()).not.toHaveAttribute('open')
    await expect(nationalJobsPage.offenceFilter1()).not.toBeChecked()
    await expect(nationalJobsPage.offenceFilterSection()).not.toHaveAttribute('open')
  })

  test('National jobs tab - combined filters return expected results', async ({ page }) => {
    await stubNationalJobs(nationalJobsQueries.nationalJobsCleaningAndArson, nationalJobsCleaningAndArsonResponse)
    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await nationalJobsPage.jobSectorFilterOther1().click()

    await nationalJobsPage.offenceFilterSectionToggle().click()
    await nationalJobsPage.offenceFilter1().click()

    await nationalJobsPage.applyButton().click()

    await expect(nationalJobsPage.resultsCounter()).toHaveText('1 result')
    await expect(nationalJobsPage.jobSectorFilterOther1()).toBeChecked()
    await expect(nationalJobsPage.offenceFilter1()).toBeChecked()

    const rows = await nationalJobsPage.tableData()
    expect(rows).toHaveLength(1)
    expect(rows[0].jobRole).toContain('Cleaner')
    expect(rows[0].typeOfWork).toContain('Cleaning and maintenance')
  })

  test.describe('with offence filtering disabled', () => {
    test.use({ offenceFilterEnabled: false })

    test('National jobs tab - offence exclusions are hidden', async ({ page }) => {
      await page.goto('/mjma/G6115VK/jobs/national-jobs')
      const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

      await expect(nationalJobsPage.offenceFilterSection()).toHaveCount(0)
      await expect(nationalJobsPage.offenceFilter1()).toHaveCount(0)
      await expect(nationalJobsPage.jobSectorsFilterOtherSection()).toBeVisible()
    })
  })
})
