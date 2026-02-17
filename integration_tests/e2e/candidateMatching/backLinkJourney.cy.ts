/* eslint-disable @typescript-eslint/no-unused-vars */
import JobDetailsPage from '../../pages/candidateMatching/jobDetails'
import ManageApplicationPage from '../../pages/candidateMatching/manageApplication'
import MatchedJobsPage from '../../pages/candidateMatching/matchedJobs'

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
    cy.task('getApplicationHistory', { jobId: '0190a227-be75-7009-8ad6-c6b068b6754e', offenderNo: 'G6115VJ' })
    cy.task('updateApplicationHistory', '019320a4-a8a5-7667-aeb4-fdd8d7e48c2c')
  })

  it('Manage applications - check content', () => {
    cy.signIn()
    cy.visit('/mjma/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')
    jobDetailsPage.manageApplicationsButton().click()

    const manageApplicationPage = new ManageApplicationPage("Manage Test User1's application")

    manageApplicationPage.jobTitle().contains('Warehouse operator')
    manageApplicationPage.employerName().contains('ASDA')
    manageApplicationPage.jobLocation().contains('NE236DR')
    manageApplicationPage.closingDate().contains('01 Feb 2025')
    manageApplicationPage.howToApply().contains('Some apply details')

    // Check table data
    manageApplicationPage.tableData().then(entries => {
      expect(entries[0].status).to.contain('Application made')
      expect(entries[0].status).to.contain('12 Nov 2024')
      expect(entries[0].status).to.contain('Joe Bloggs')
      expect(entries[0].moreInformation).to.contain('Some info')

      expect(entries[1].status).to.contain('Job offer')
      expect(entries[1].status).to.contain('12 Nov 2024')
      expect(entries[1].status).to.contain('Joe Bloggs')
      expect(entries[1].moreInformation).to.contain('None entered')
    })
  })

  it('Manage applications - validation and submit', () => {
    cy.signIn()
    cy.visit('/mjma/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')
    jobDetailsPage.manageApplicationsButton().click()

    const manageApplicationPage = new ManageApplicationPage("Manage Test User1's application")

    manageApplicationPage.updateProgressButton().click()

    manageApplicationPage.submitButton().click()

    manageApplicationPage
      .applicationStatusPageErrorMessage()
      .contains("Select an application progress for Test User1's application")
    manageApplicationPage
      .applicationStatusFieldErrorMessage()
      .contains("Select an application progress for Test User1's application")

    manageApplicationPage.applicationStatus().select('APPLICATION_MADE')
    manageApplicationPage.additionalInformation().type('Some info')

    manageApplicationPage.submitButton().click()
  })

  it('Back from Manage applications to Job detail', () => {
    cy.signIn()
    cy.visit('/mjma/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')
    jobDetailsPage.manageApplicationsButton().click()

    const manageApplicationPage = new ManageApplicationPage("Manage Test User1's application")
    manageApplicationPage.jobTitle().contains('Warehouse operator')

    manageApplicationPage.backLinkUrl().click()

    jobDetailsPage.employerName().contains('ASDA')
    jobDetailsPage.jobTitle().contains('Warehouse operator')
  })

  it('Back from Job detail to Matched jobs', () => {
    cy.signIn()
    cy.visit('/mjma/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')
    jobDetailsPage.manageApplicationsButton().click()

    const manageApplicationPage = new ManageApplicationPage("Manage Test User1's application")
    manageApplicationPage.jobTitle().contains('Warehouse operator')

    manageApplicationPage.backLinkUrl().click()

    jobDetailsPage.employerName().contains('ASDA')
    jobDetailsPage.jobTitle().contains('Warehouse operator')

    manageApplicationPage.backLinkUrl().click()

    const matchedJobsPage = new MatchedJobsPage("Test User1's work profile")
    cy.get('#prisoner-name').contains('User1, Test')
    cy.get('[data-qa="tab-overview"]').should('have.attr', 'aria-current', 'page')

    // Assert that other tabs are not selected
    cy.get('[data-qa="tab-details"]').should('not.have.attr', 'aria-current')
    cy.get('[data-qa="tab-training"]').should('not.have.attr', 'aria-current')
    cy.get('[data-qa="tab-contacts"]').should('not.have.attr', 'aria-current')
  })
})
