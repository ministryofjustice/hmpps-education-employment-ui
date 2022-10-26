import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'

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
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const supportDeclinedReason = Page.verifyOnPage(AlreadyInPlacePage)

    supportDeclinedReason.submitButton().click()

    supportDeclinedReason.reasonPageErrorMessage().contains('Select what Daniel Craig has in place already')
    supportDeclinedReason.reasonFieldErrorMessage().contains('Select what Daniel Craig has in place already')
  })

  it('New record - Select BANK_ACCOUNT - navigates to ability-to-work page', () => {
    const supportDeclinedReason = Page.verifyOnPage(AlreadyInPlacePage)

    supportDeclinedReason.checkboxFieldValue('BANK_ACCOUNT').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'ability-to-work/new')
  })

  it('New record - Select ID - navigates to identification page', () => {
    const supportDeclinedReason = Page.verifyOnPage(AlreadyInPlacePage)

    supportDeclinedReason.checkboxFieldValue('ID').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'identification/new')
  })

  it('Existing record - Select BANK_ACCOUNT - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/already-in-place/edit')

    const supportDeclinedReason = Page.verifyOnPage(AlreadyInPlacePage)

    supportDeclinedReason.checkboxFieldValue('BANK_ACCOUNT').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select ID - navigates to identification page', () => {
    cy.visit('/work-profile/create/G6115VJ/already-in-place/edit')

    const supportDeclinedReason = Page.verifyOnPage(AlreadyInPlacePage)

    supportDeclinedReason.checkboxFieldValue('ID').click()
    supportDeclinedReason.submitButton().click()

    cy.url().should('include', 'identification/edit')
  })
})
