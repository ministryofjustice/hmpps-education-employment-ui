/* eslint-disable @typescript-eslint/no-unused-vars */
import ManageApplicationPage from '../pages/manageApplication'
import MatchedJobsPage from '../pages/matchedJobs'
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
    cy.task('jobSearch')
  })

  it('CMS Tabs - Check content', () => {
    cy.visit('/cms/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")

    workProfilePage.releaseArea().contains('L15 7LR')

    workProfilePage.matchedJobsByIndexTitle(1).contains('Forklift operator')
    workProfilePage.matchedJobsByIndexEmployer(1).contains('Amazon')
    workProfilePage.matchedJobsByIndexClosingDate(1).contains('01 May 2022')

    workProfilePage.jobsOfInterestByIndexTitle(1).contains('Warehouse handler')
    workProfilePage.jobsOfInterestByIndexEmployer(1).contains('Tesco')
    workProfilePage.jobsOfInterestByIndexClosingDate(1).contains('02 May 2022')

    workProfilePage.openApplicationsTab().click()

    workProfilePage.openApplicationByIndexJob(1).contains('Vegetable packing operative')
    workProfilePage.openApplicationByIndexEmployer(1).contains('CBS Labour')
    workProfilePage.openApplicationByIndexStatus(1).contains('Application made')

    workProfilePage.closedApplicationsTab().click()

    workProfilePage.closedApplicationByIndexJob(1).contains('Forklift operator')
    workProfilePage.closedApplicationByIndexEmployer(1).contains('Z Labour')
    workProfilePage.closedApplicationByIndexStatus(1).contains('Application unsuccessful')
  })

  it('Navigate to matched jobs', () => {
    cy.task('getJobDetails', '2')
    cy.task('getApplicationHistory')
    cy.visit('/cms/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")

    workProfilePage.viewMatchedJobsLink().click()

    cy.url().should('include', '/cms/G6115VJ/jobs/matched')

    const matchedJobsPage = new MatchedJobsPage('Jobs for Daniel Craig')
    matchedJobsPage.backLink().click()

    cy.url().should('include', '/cms/profile/G6115VJ/view/overview')
  })

  it('Navigate to open application details', () => {
    cy.task('getJobDetails', '2')
    cy.task('getApplicationHistory')

    cy.visit('/cms/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")

    workProfilePage.openApplicationsTab().click()
    workProfilePage.openApplicationByIndexViewDetailsLink(1).click()

    cy.url().should('include', '/cms/G6115VJ/job/2/application/update')

    const manageApplicationPage = new ManageApplicationPage("Manage Daniel Craig's application")
    manageApplicationPage.backLink().click()

    cy.url().should('include', '/cms/profile/G6115VJ/view/overview')
  })

  it('Navigate to closed application details', () => {
    cy.task('getJobDetails', '3')
    cy.task('getApplicationHistory')

    cy.visit('/cms/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")

    workProfilePage.closedApplicationsTab().click()
    workProfilePage.closedApplicationByIndexViewDetailsLink(1).click()

    cy.url().should('include', '/cms/G6115VJ/job/3/application/update')

    const manageApplicationPage = new ManageApplicationPage("Manage Daniel Craig's application")
    manageApplicationPage.backLink().click()

    cy.url().should('include', '/cms/profile/G6115VJ/view/overview')
  })
})
