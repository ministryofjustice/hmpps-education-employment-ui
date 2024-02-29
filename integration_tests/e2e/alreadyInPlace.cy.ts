import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserRoles')
    cy.task('getPrisonerById')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit('/wr/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Daniel Craig want support to get work?')
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')

    alreadyInPlace.submitButton().click()

    alreadyInPlace.pageErrorMessage().contains('Select what Daniel Craig has in place already')
    alreadyInPlace.fieldErrorMessage().contains('Select what Daniel Craig has in place already')
  })

  it('New record - Select BANK_ACCOUNT - navigates to ability-to-work page', () => {
    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')

    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'ability-to-work/new')
  })

  it('New record - Select ID - navigates to identification page', () => {
    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')

    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'identification/new')
  })

  it('Existing record - Select BANK_ACCOUNT - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/already-in-place/edit')

    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')

    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select ID - navigates to identification page', () => {
    cy.visit('/wr/profile/create/G6115VJ/already-in-place/edit')

    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')

    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()

    cy.url().should('include', 'identification/edit')
  })
})
