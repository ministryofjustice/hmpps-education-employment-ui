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
    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)
  })

  it('Validation messages display when no value selected', () => {
    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)

    alreadyInPlace.submitButton().click()

    alreadyInPlace.pageErrorMessage().contains('Select what Daniel Craig has in place already')
    alreadyInPlace.fieldErrorMessage().contains('Select what Daniel Craig has in place already')
  })

  it('New record - Select BANK_ACCOUNT - navigates to ability-to-work page', () => {
    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)

    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'ability-to-work/new')
  })

  it('New record - Select ID - navigates to identification page', () => {
    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)

    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'identification/new')
  })

  it('Existing record - Select BANK_ACCOUNT - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/already-in-place/edit')

    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)

    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select ID - navigates to identification page', () => {
    cy.visit('/work-profile/create/G6115VJ/already-in-place/edit')

    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)

    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'identification/edit')
  })
})
