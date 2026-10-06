import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'
import { stubFor } from '../../mockApis/wiremock'
import manageUsersApi from '../../mockApis/manageUsersApi'
import nomisUserRolesApi from '../../mockApis/nomisUserRolesApi'
import config from '../../../server/config'

const PRISONER_ID = 'A1111AB'
const WR_CONTINUE_URL = '/wr/cohort-list?sort=releaseDate&order=ascending'
const MJMA_CONTINUE_URL = '/mjma/prisoners?sort=releaseDate&order=ascending'

const wrCreateProfileUrl = (page: string) => `/wr/profile/create/${PRISONER_ID}/${page}`

const wrRoutes = [
  wrCreateProfileUrl('ability-to-work/new'),
  wrCreateProfileUrl('already-in-place/new'),
  wrCreateProfileUrl('check-answers'),
  wrCreateProfileUrl('identification/new'),
  wrCreateProfileUrl('ineligable-to-work/new'),
  wrCreateProfileUrl('job-of-particular-interest/new'),
  wrCreateProfileUrl('manage-drugs-and-alcohol/new'),
  wrCreateProfileUrl('right-to-work/new'),
  wrCreateProfileUrl('support-declined-reason/new'),
  wrCreateProfileUrl('support-opt-in/new'),
  wrCreateProfileUrl('training-and-qualifications/new'),
  wrCreateProfileUrl('type-of-work/new'),
  wrCreateProfileUrl('what-needs-to-change/new'),
  wrCreateProfileUrl('work-experience/new'),
  `/wr/profile/actions/${PRISONER_ID}/edit/cv-and-covering-letter`,
].map(url => ({ url, continueUrl: WR_CONTINUE_URL, mjma: false }))

const mjmaRoutes = [
  `/mjma/${PRISONER_ID}/jobs/matched`,
  `/mjma/${PRISONER_ID}/jobs/archived`,
  `/mjma/${PRISONER_ID}/jobs/interested`,
  `/mjma/${PRISONER_ID}/jobs/national-jobs`,
  `/mjma/${PRISONER_ID}/job/1/details`,
  `/mjma/${PRISONER_ID}/job/1/application/view`,
].map(url => ({ url, continueUrl: MJMA_CONTINUE_URL, mjma: true }))

const routes = [
  ...wrRoutes,
  { url: `/wr/profile/${PRISONER_ID}/view/overview`, continueUrl: WR_CONTINUE_URL, mjma: false },
  { url: `/mjma/profile/${PRISONER_ID}/view/overview`, continueUrl: MJMA_CONTINUE_URL, mjma: true },
  ...mjmaRoutes,
]

const failureCases = [
  {
    name: 'prisoner is not in the active caseload',
    stub: () => stubPrisonerSearch([]),
  },
  {
    name: 'prisoner has no release date',
    stub: () =>
      stubPrisonerSearch([{ prisonerNumber: PRISONER_ID, firstName: 'SUSAN', lastName: 'VICTOR', releaseDate: '' }]),
  },
  {
    name: 'prisoner search fails',
    stub: () =>
      stubFor({
        request: { method: 'GET', urlPathPattern: '/prison/\\w+/prisoners' },
        response: { status: 500 },
      }),
  },
]

function stubPrisonerSearch(content: Record<string, unknown>[]) {
  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/prison/\\w+/prisoners',
      queryParameters: { term: { matches: '.*' } },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { content, empty: content.length === 0, totalElements: content.length },
    },
  })
}

function stubProfileStatus(status: string) {
  return stubFor({
    request: { method: 'GET', urlPattern: `/readiness-profiles/${PRISONER_ID}` },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { offenderId: PRISONER_ID, profileData: { status } },
    },
  })
}

test.describe('Prisoner profile view criteria', () => {
  const { candidateMatchingEnabled } = config.featureToggles

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
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  routes.forEach(({ url, continueUrl, mjma }) => {
    failureCases.forEach(({ name, stub }) => {
      test(`${url} renders 404 when ${name}`, async ({ page }) => {
        test.skip(mjma && !candidateMatchingEnabled, 'Candidate matching is disabled')
        await stub()

        const response = await page.goto(url)

        expect(response?.status()).toBe(404)
        await expect(page.getByTestId('not-found')).toHaveText('Page not found')
        await expect(page.getByRole('button', { name: 'Continue' })).toHaveAttribute('href', continueUrl)
      })
    })
  })

  test('MJMA route renders 404 when profile status is not eligible', async ({ page }) => {
    test.skip(!candidateMatchingEnabled, 'Candidate matching is disabled')
    await stubPrisonerSearch([
      { prisonerNumber: PRISONER_ID, firstName: 'SUSAN', lastName: 'VICTOR', releaseDate: '2026-03-02' },
    ])
    await stubProfileStatus('NO_RIGHT_TO_WORK')

    const response = await page.goto(`/mjma/${PRISONER_ID}/jobs/matched`)

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('button', { name: 'Continue' })).toHaveAttribute('href', MJMA_CONTINUE_URL)
  })
})
