import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import SupportDeclinedReasonPage from '../pages/supportDeclinedReason'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('stubVerifyToken', true)
    cy.signIn()
    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')
    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()
    const supportOptIn = Page.verifyOnPage(SupportOptIn)
    supportOptIn.radioFieldNo().click()
    supportOptIn.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const supportOptIn = Page.verifyOnPage(SupportDeclinedReasonPage)

    supportOptIn.submitButton().click()

    supportOptIn.reasonPageErrorMessage().contains('Select the reason why Daniel Craig does not want support')
    supportOptIn.reasonFieldErrorMessage().contains('Select the reason why Daniel Craig does not want support')

    supportOptIn.checkboxFieldValue('OTHER').click()
    supportOptIn.submitButton().click()

    supportOptIn.detailsPageErrorMessage().contains('Enter the reason why Daniel Craig does not want support')
    supportOptIn.detailsFieldErrorMessage().contains('Enter the reason why Daniel Craig does not want support')
  })

  it('New record - Select YES - navigates to support-opt-in page', () => {
    const supportOptIn = Page.verifyOnPage(SupportDeclinedReasonPage)

    supportOptIn.checkboxFieldValue('NO_REASON').click()
    supportOptIn.submitButton().click()

    cy.url().should('include', 'change-required-for-support/new')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/support-declined-reason/edit')

    const supportOptIn = Page.verifyOnPage(SupportDeclinedReasonPage)

    supportOptIn.checkboxFieldValue('NO_REASON').click()
    supportOptIn.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
