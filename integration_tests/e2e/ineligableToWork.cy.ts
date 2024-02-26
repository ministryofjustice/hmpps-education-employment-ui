import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import IneligableToWorkPage from '../pages/ineligableToWork'
import CohortListPage from '../pages/cohortList'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('createProfile', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('getProfileById')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
  })

  it('New record - Select NO - navigates to ineligable-to-work page', () => {
    cy.signIn()

    cy.visit('/wr/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')

    rightToWorkPage.radioFieldNo().click()
    rightToWorkPage.submitButton().click()

    const ineligableToWork = new IneligableToWorkPage('Daniel Craig is not allowed to work in the UK')

    ineligableToWork.submitButton().click()

    Page.verifyOnPage(CohortListPage, 'Get someone ready to work')
  })
})
