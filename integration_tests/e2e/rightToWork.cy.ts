import cypress from 'cypress'
import IndexPage from '../pages/index'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'
import RightToWorkPage from '../pages/rightToWork'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('stubVerifyToken', true)
  })

  it('Validation messages display when no value selected', () => {
    cy.signIn()

    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)

    rightToWorkPage.submitButton().click()

    rightToWorkPage.pageErrorMessage().contains('Select if Daniel Craig has the right to work in the UK or not')
    rightToWorkPage.fieldErrorMessage().contains('Select if Daniel Craig has the right to work in the UK or not')
  })

  it('New record - Select YES - navigates to support-opt-in page', () => {
    cy.signIn()

    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)

    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    // Todo: Change to verify on page when pages developed
    cy.url().should('include', 'support-opt-in/new')
  })

  it('New record - Select NO - navigates to ineligable-to-work page', () => {
    cy.signIn()

    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)

    rightToWorkPage.radioFieldNo().click()
    rightToWorkPage.submitButton().click()

    // Todo: Change to verify on page when pages developed
    cy.url().should('include', 'ineligable-to-work')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.signIn()

    cy.visit('/work-profile/create/G6115VJ/right-to-work/edit')

    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)

    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    // Todo: Change to verify on page when pages developed
    cy.url().should('include', 'check-answers')
  })
})
