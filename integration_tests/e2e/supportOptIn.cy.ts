import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit('/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const supportOptInPage = new SupportOptInPage('Does Daniel Craig want support to get work?')

    supportOptInPage.submitButton().click()

    supportOptInPage.pageErrorMessage().contains('Select if Daniel Craig wants support to get work or not')
    supportOptInPage.fieldErrorMessage().contains('Select if Daniel Craig wants support to get work or not')
  })

  it('New record - Select YES - navigates to support-opt-in page', () => {
    const supportOptInPage = new SupportOptInPage('Does Daniel Craig want support to get work?')

    supportOptInPage.radioFieldYes().click()
    supportOptInPage.submitButton().click()

    cy.url().should('include', 'already-in-place/new')
  })

  it('New record - Select NO - navigates to no-support-reason page', () => {
    const supportOptInPage = new SupportOptInPage('Does Daniel Craig want support to get work?')

    supportOptInPage.radioFieldNo().click()
    supportOptInPage.submitButton().click()

    cy.url().should('include', 'support-declined-reason/new')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.visit('/profile/create/G6115VJ/support-opt-in/edit')

    const supportOptInPage = new SupportOptInPage('Does Daniel Craig want support to get work?')

    supportOptInPage.radioFieldYes().click()
    supportOptInPage.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
