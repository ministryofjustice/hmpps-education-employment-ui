import { expect, test as base } from '@playwright/test'
import { login } from '../testUtils'
import manageUsersApi from '../../mockApis/manageUsersApi'
import nomisUserRolesApi from '../../mockApis/nomisUserRolesApi'

export { expect } from '@playwright/test'

type FeatureToggleOptions = {
  offenceFilterEnabled: boolean
  nationalJobsEnabled: boolean
}

export const test = base.extend<FeatureToggleOptions>({
  offenceFilterEnabled: [true, { option: true }],
  nationalJobsEnabled: [true, { option: true }],
  page: async ({ page, offenceFilterEnabled, nationalJobsEnabled }, use) => {
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

    const response = await page.request.get('/api/features-enabled')
    await expect(response).toBeOK()
    const featureToggles: FeatureToggleOptions = await response.json()
    expect(typeof featureToggles.offenceFilterEnabled).toBe('boolean')
    expect(typeof featureToggles.nationalJobsEnabled).toBe('boolean')
    test.skip(
      featureToggles.nationalJobsEnabled !== nationalJobsEnabled,
      `Requires the application server to run with NATIONAL_JOBS=${nationalJobsEnabled}`,
    )
    test.skip(
      featureToggles.offenceFilterEnabled !== offenceFilterEnabled,
      `Requires the application server to run with OFFENCE_FILTER_ENABLED=${offenceFilterEnabled}`,
    )

    await use(page)
  },
})
