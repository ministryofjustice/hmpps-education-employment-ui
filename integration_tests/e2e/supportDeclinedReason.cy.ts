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
    const supportDeclinedReason = Page.verifyOnPage(SupportDeclinedReasonPage)

    supportDeclinedReason.submitButton().click()

    supportDeclinedReason.reasonPageErrorMessage().contains('Select the reason why Daniel Craig does not want support')
    supportDeclinedReason.reasonFieldErrorMessage().contains('Select the reason why Daniel Craig does not want support')

    supportDeclinedReason.checkboxFieldValue('OTHER').click()
    supportDeclinedReason.submitButton().click()

    supportDeclinedReason.detailsPageErrorMessage().contains('Enter the reason why Daniel Craig does not want support')
    supportDeclinedReason.detailsFieldErrorMessage().contains('Enter the reason why Daniel Craig does not want support')
  })

  it('New record - Select YES - navigates to what-needs-to-change page', () => {
    const supportDeclinedReason = Page.verifyOnPage(SupportDeclinedReasonPage)

    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'what-needs-to-change/new')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/support-declined-reason/edit')

    const supportDeclinedReason = Page.verifyOnPage(SupportDeclinedReasonPage)

    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
