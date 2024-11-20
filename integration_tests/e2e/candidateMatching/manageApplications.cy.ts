/* eslint-disable @typescript-eslint/no-unused-vars */

import JobDetailsPage from '../../pages/candidateMatching/jobDetails'
import ManageApplicationPage from '../../pages/candidateMatching/manageApplication'

context('Sign In', () => {
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
    cy.task('getEmployer', '01907e1e-bb85-7bb7-9018-33a2070a367d')
    cy.task('getJob', '0190a227-be75-7009-8ad6-c6b068b6754e')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('createArchiveRecord', { jobId: '0190a227-be75-7009-8ad6-c6b068b6754e', offenderNo: 'G6115VJ' })
    cy.task('getApplicationHistory')
  })

  it('View job details - check manage applications', () => {
    cy.signIn()
    cy.visit('/mjma/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')
    jobDetailsPage.manageApplicationsButton().click()

    const manageApplicationPage = new ManageApplicationPage("Manage Daniel Craig's application")

    manageApplicationPage.jobTitle().contains('Warehouse operator')
    manageApplicationPage.employerName().contains('ASDA')
    manageApplicationPage.jobLocation().contains('NE236DR')
    manageApplicationPage.closingDate().contains('01 Feb 2025')
    manageApplicationPage.howToApply().contains('Some apply details')

    manageApplicationPage.updateProgressButton().click()

    manageApplicationPage.submitButton().click()
  })
})
