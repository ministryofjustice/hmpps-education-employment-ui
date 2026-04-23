import { expect, test } from '@playwright/test'
import prisonApi from '../../../mockApis/prisonApi'

import { login, resetStubs } from '../../testUtils'
import MatchedJobsPage from '../../pages/candidateMatching/matchedJobs'

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
    await jobApi.getMatchedJobs('releaseArea=L15%207LR&searchRadius=50&isNationalJob=false')
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
    expect(rows).toHaveLength(10)
    expect(rows[0].jobRole).toContain('Forklift operator')
    expect(rows[0].jobRole).toContain('Amazon')
    expect(rows[0].jobRole).toContain('Prisoner choice')
    expect(rows[0].typeOfWork).toContain('Animal care and farming')
    expect(rows[0].location).toContain('LS23 3JF')
    expect(rows[0].location).toContain('4.1 miles')
    expect(rows[0].closingDate).toContain('03 Jun 2024')

    // Verify count of results
    expect(matchedJobsPage.resultsCounter()).toContainText('20 results')
  })

  test('Matched jobs tab - no results', async ({ page }) => {
    await page.goto('/mjma/G6115VK/jobs/matched')
    const matchedJobsPage = await MatchedJobsPage.verifyOnPage(page, 'Test User7')
    // Change filter to return no jobs - verify results message
    await matchedJobsPage.jobSectorsFilterOtherSectionToggle().click()
    await matchedJobsPage.jobSectorFilter1().click()
    await matchedJobsPage.applyButton().click()
    expect(matchedJobsPage.resultsCounter()).toContainText('0 results')
    expect(matchedJobsPage.tableData()).toHaveLength(0)
  })
})
