import RightToWorkPage from '../pages/rightToWork'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
    cy.task('stubVerifyToken', true)
  })

  it('Validation messages display when no value selected', () => {
    cy.signIn()

    cy.visit('/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')

    rightToWorkPage.submitButton().click()

    rightToWorkPage.pageErrorMessage().contains('Select if Daniel Craig has the right to work in the UK or not')
    rightToWorkPage.fieldErrorMessage().contains('Select if Daniel Craig has the right to work in the UK or not')
  })

  it('New record - Select YES - navigates to support-opt-in page', () => {
    cy.signIn()

    cy.visit('/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')

    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    cy.url().should('include', 'support-opt-in/new')
  })

  it('New record - Select NO - navigates to ineligable-to-work page', () => {
    cy.signIn()

    cy.visit('/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')

    rightToWorkPage.radioFieldNo().click()
    rightToWorkPage.submitButton().click()

    cy.url().should('include', 'ineligable-to-work')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.signIn()

    cy.visit('/profile/create/G6115VJ/right-to-work/edit')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')

    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
