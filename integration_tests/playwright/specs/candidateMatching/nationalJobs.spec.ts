import { expect, test } from '../../fixtures/featureToggles'

import { resetStubs } from '../../testUtils'
import NationalJobsPage from '../../pages/candidateMatching/nationalJobs'

import jobApi from '../../../mockApis/jobApi'
import prisonerSearchApi from '../../../mockApis/prisonerSearchApi'
import esweProfileApi from '../../../mockApis/esweProfileApi'
import deliusIntegrationApi from '../../../mockApis/deliusIntegrationApi'
import {
  defaultNationalJobsResponse,
  emptyNationalJobsResponse,
  nationalJobsQueries,
  offenceExclusionNationalJobsResponse,
  stubNationalJobs,
} from '../../../mockData/nationalJobsFilterData'

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

  test('National jobs tab - employer filter updates results', async ({ page }) => {
    const employerId = '019a15bc-2444-711d-83c0-892a1d9a57c0'
    await stubNationalJobs(nationalJobsQueries.nationalJobsEmployerFilter(employerId), emptyNationalJobsResponse)

    await page.goto('/mjma/G6115VK/jobs/national-jobs')
    const nationalJobsPage = await NationalJobsPage.verifyOnPage(page, 'Test User7')

    await nationalJobsPage.employerFilter().selectOption(employerId)
    await nationalJobsPage.applyButton().click()

    await expect(page.getByText('0 results')).toBeVisible()
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
