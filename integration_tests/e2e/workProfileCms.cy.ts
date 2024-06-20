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

    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getCurrentOffenderActivities', 'G6115VJ')
    cy.task('getKeyworker', 'G6115VJ')
    cy.task('getUnacceptableAbsenceCount', 'G6115VJ')
    cy.task('getPomForOffender', 'G6115VJ')
    cy.task('getCommunityManager', 'G6115VJ')
    cy.task('getPrisonerAddress', 'G6115VJ')
    cy.task('getMatchedJobsClosingSoon')
    cy.task('getJobOfInterestClosingSoon', 'G6115VJ')
    cy.task('getOpenApplications', 'G6115VJ')
    cy.task('getClosedApplications', 'G6115VJ')
  })

  it('Check content', () => {
    cy.visit('/cms/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")

    workProfilePage.releaseArea().contains('L15 7LR')
  })

  it('Navigate to matched jobs', () => {
    cy.visit('/cms/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")

    workProfilePage.releaseArea().contains('L15 7LR')
  })
})
