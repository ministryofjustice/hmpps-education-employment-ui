import { test, expect } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import JobDetailsPage from '../../pages/candidateMatching/jobDetails'
import ManageApplicationPage from '../../pages/candidateMatching/manageApplication'
import manageUsersApi from '../../../mockApis/manageUsersApi'
import nomisUserRolesApi from '../../../mockApis/nomisUserRolesApi'
import jobApi from '../../../mockApis/jobApi'
import prisonerSearchApi from '../../../mockApis/prisonerSearchApi'
import esweProfileApi from '../../../mockApis/esweProfileApi'
import jobApplicationApi from '../../../mockApis/jobApplicationApi'
import deliusIntegrationApi from '../../../mockApis/deliusIntegrationApi'

// NOTE: You must adapt your Playwright page objects to accept a Playwright 'page' instance.
// See below for an example Playwright page object implementation.

test.describe('Sign In', () => {
  test.beforeEach(async ({ page }) => {
    await resetStubs()

    await manageUsersApi.stubAuthUser()
    await nomisUserRolesApi.getUserActiveCaseLoad()
    await login(page, {
      name: 'Joe Bloggs',
      roles: [
        'ROLE_EDUCATION_WORK_PLAN_EDITOR',
        'ROLE_EDUCATION_WORK_PLAN_VIEWER',
        'ROLE_WORK_READINESS_EDITOR',
        'ROLE_WORK_READINESS_VIEWER',
      ],
    })

    await jobApi.getEmployer('01907e1e-bb85-7bb7-9018-33a2070a367d')
    await jobApi.getJob('0190a227-be75-7009-8ad6-c6b068b6754e')
    await prisonerSearchApi.getPrisonerByCaseLoadIdAndOffenderId('G6115VK')
    await prisonerSearchApi.getPrisonerById('G6115VK')
    await esweProfileApi.getProfileById('G6115VK')
    await manageUsersApi.stubGetUser({ username: 'USER1', name: 'Joe Bloggs' })
    await jobApi.createArchiveRecord({ jobId: '0190a227-be75-7009-8ad6-c6b068b6754e', offenderNo: 'G6115VK' })
    await jobApplicationApi.getApplicationHistory({
      jobId: '0190a227-be75-7009-8ad6-c6b068b6754e',
      offenderNo: 'G6115VK',
    })
    await jobApplicationApi.updateApplicationHistory('019320a4-a8a5-7667-aeb4-fdd8d7e48c2c')
    await deliusIntegrationApi.getPrisonerAddress('G6115VK')
  })

  test('Manage applications - check content', async ({ page }) => {
    await page.goto('/mjma/G6115VK/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage(page)
    await jobDetailsPage.manageApplicationsButton().click()

    const manageApplicationPage = new ManageApplicationPage(page)

    await expect(manageApplicationPage.jobTitle()).toContainText('Warehouse operator')
    await expect(manageApplicationPage.employerName()).toContainText('ASDA')
    await expect(manageApplicationPage.jobLocation()).toContainText('NE236DR')
    await expect(manageApplicationPage.closingDate()).toContainText('01 Feb 2025')
    await expect(manageApplicationPage.howToApply()).toContainText('Some apply details')

    // Table data check
    const rows = await manageApplicationPage.tableData()
    expect(rows[0].status).toContain('Application made')
    expect(rows[0].status).toContain('12 Nov 2024')
    expect(rows[0].status).toContain('Joe Bloggs')
    expect(rows[0].moreInformation).toContain('Some info')

    expect(rows[1].status).toContain('Job offer')
    expect(rows[1].status).toContain('12 Nov 2024')
    expect(rows[1].status).toContain('Joe Bloggs')
    expect(rows[1].moreInformation).toContain('None entered')
  })

  test('Manage applications - validation and submit', async ({ page }) => {
    await page.goto('/mjma/G6115VK/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage(page)
    await jobDetailsPage.manageApplicationsButton().click()

    const manageApplicationPage = new ManageApplicationPage(page)
    await manageApplicationPage.updateProgressButton().click()
    await manageApplicationPage.submitButton().click()

    await expect(manageApplicationPage.applicationStatusPageErrorMessage()).toContainText(
      "Select an application progress for Test User7's application",
    )
    await expect(manageApplicationPage.applicationStatusFieldErrorMessage()).toContainText(
      "Select an application progress for Test User7's application",
    )

    await manageApplicationPage.applicationStatus().selectOption('APPLICATION_MADE')
    await manageApplicationPage.additionalInformation().fill('Some info')
    await manageApplicationPage.submitButton().click()
  })
})
