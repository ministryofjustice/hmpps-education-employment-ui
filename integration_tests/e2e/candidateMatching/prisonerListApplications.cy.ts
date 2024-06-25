/* eslint-disable @typescript-eslint/no-unused-vars */
import PrisonerListApplicationsPage from '../../pages/candidateMatching/prisonerListApplications'

context('PrisonerListApplications', () => {
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
    cy.task('applicationSearch')
  })

  it('Check content', () => {
    cy.visit('/cms/applications')

    const workProfilePage = new PrisonerListApplicationsPage('View matched jobs and manage applications')
  })

  // it('Navigation - Checks tabs and links', () => {
  //   cy.visit('/cms/prisoners')

  // })

  // it('Filters - Positive - Check filter functionality', () => {
  //   cy.visit('/cms/prisoners')

  // })

  // it('Filters - Negative - Check filter validation', () => {
  //   cy.visit('/cms/prisoners')

  // })

  // it('Sorting - Check sorting and pagination', () => {
  //   cy.visit('/cms/prisoners')

  // })
})
