import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
    cy.signIn()
    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')
    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const supportOptIn = Page.verifyOnPage(SupportOptIn)

    supportOptIn.submitButton().click()

    supportOptIn.pageErrorMessage().contains('Select if Daniel Craig wants support to get work or not')
    supportOptIn.fieldErrorMessage().contains('Select if Daniel Craig wants support to get work or not')
  })

  it('New record - Select YES - navigates to support-opt-in page', () => {
    const supportOptIn = Page.verifyOnPage(SupportOptIn)

    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()

    cy.url().should('include', 'already-in-place/new')
  })

  it('New record - Select NO - navigates to no-support-reason page', () => {
    const supportOptIn = Page.verifyOnPage(SupportOptIn)

    supportOptIn.radioFieldNo().click()
    supportOptIn.submitButton().click()

    cy.url().should('include', 'support-declined-reason/new')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/support-opt-in/edit')

    const supportOptIn = Page.verifyOnPage(SupportOptIn)

    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
