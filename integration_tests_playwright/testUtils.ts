import { expect, Page } from '@playwright/test'
import AbstractPage from './pages/abstractPage'
import hmppsAuth, { type UserToken } from './mockApis/hmppsAuth'

export const attemptHmppsAuthLogin = async (page: Page) => {
  await page.goto('/')
  page.locator('h1', { hasText: 'Sign in' })
  const url = await hmppsAuth.getSignInUrl()
  await page.goto(url)
}

export const login = async (
  page: Page,
  { name, roles = DEFAULT_ROLES, active = true, authSource = 'nomis' }: UserToken & { active?: boolean } = {}
) => {
  await Promise.all([
    hmppsAuth.favicon(),
    hmppsAuth.stubSignInPage(),
    hmppsAuth.stubSignOutPage(),
    hmppsAuth.token({ name, roles, authSource }),
    tokenVerification.stubVerifyToken(active),
  ])
  await attemptHmppsAuthLogin(page)
}

export const verifyOnPage = async <T extends AbstractPage>(
  page: Page,
  constructor: new (page: Page) => T
): Promise<T> => {
  const pageInstance = new constructor(page)
  await expect(pageInstance.header).toBeVisible()
  return pageInstance
}