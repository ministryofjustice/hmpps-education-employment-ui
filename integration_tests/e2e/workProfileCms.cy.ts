/* eslint-disable @typescript-eslint/no-unused-vars */
import WorkProfilePage from '../pages/workProfile'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserRoles')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('getStaffDetails')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
    cy.signIn()
  })

  it('Check content - MJMA overview', () => {
    cy.task('getPrisonerByCaseLoadIdAndOffenderId', 'H4115SD')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')
    cy.task('getCommunityManager', 'H4115SD')
    cy.task('getPrisonerAddress', 'H4115SD')

    cy.visit('/wr/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Test User1's work profile")
  })
})
