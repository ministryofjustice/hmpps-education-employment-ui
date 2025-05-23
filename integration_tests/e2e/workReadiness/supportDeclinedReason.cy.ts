import RightToWorkPage from '../../pages/workReadiness/rightToWork'
import SupportOptInPage from '../../pages/workReadiness/supportOptIn'
import SupportDeclinedReasonPage from '../../pages/workReadiness/supportDeclinedReason'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserRoles')
    cy.task('getPrisonerById')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit('/wr/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Test User1 want support to get work?')
    supportOptIn.radioFieldNo().click()
    supportOptIn.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const supportDeclinedReason = new SupportDeclinedReasonPage('Why does Test User1 not want support?')

    supportDeclinedReason.submitButton().click()

    supportDeclinedReason.reasonPageErrorMessage().contains('Select the reason why Test User1 does not want support')
    supportDeclinedReason.reasonFieldErrorMessage().contains('Select the reason why Test User1 does not want support')

    supportDeclinedReason.checkboxFieldValue('OTHER').click()
    supportDeclinedReason.submitButton().click()

    supportDeclinedReason.detailsPageErrorMessage().contains('Enter the reason why Test User1 does not want support')
    supportDeclinedReason.detailsFieldErrorMessage().contains('Enter the reason why Test User1 does not want support')
  })

  it('New record - Select NO_REASON - navigates to what-needs-to-change page', () => {
    const supportDeclinedReason = new SupportDeclinedReasonPage('Why does Test User1 not want support?')

    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'what-needs-to-change/new')
  })

  it('Existing record - edit - Select NO_REASON - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/support-declined-reason/edit')

    const supportDeclinedReason = new SupportDeclinedReasonPage('Why does Test User1 not want support?')

    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
