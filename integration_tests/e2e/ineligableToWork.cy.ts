import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import IneligableToWorkPage from '../pages/ineligableToWork'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('createProfile', 'G6115VJ')
    cy.task('getProfileById')
    cy.task('stubVerifyToken', true)
  })

  it('New record - Select NO - navigates to ineligable-to-work page', () => {
    cy.signIn()

    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)

    rightToWorkPage.radioFieldNo().click()
    rightToWorkPage.submitButton().click()

    const ineligableToWork = Page.verifyOnPage(IneligableToWorkPage)

    ineligableToWork.submitButton().click()

    cy.url().should('include', 'work-profile')
  })
})
