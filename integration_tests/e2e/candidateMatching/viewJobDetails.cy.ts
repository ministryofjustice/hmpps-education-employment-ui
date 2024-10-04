/* eslint-disable @typescript-eslint/no-unused-vars */

import JobDetailsPage from '../../pages/candidateMatching/jobDetails'

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
  })

  it('View job details - check loaded content', () => {
    cy.signIn()
    cy.visit('/mjma/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')

    jobDetailsPage.employerName().contains('ASDA')
    jobDetailsPage.jobTitle().contains('Warehouse operator')
    jobDetailsPage.sector().contains('Warehousing and storage')
    jobDetailsPage.postcode().contains('NE236DR')
    jobDetailsPage.salaryFrom().contains('£25000.00')
    jobDetailsPage.salaryTo().contains('£30000.00')
    jobDetailsPage.salaryPeriod().contains('Per year')
    jobDetailsPage.additionalSalaryInformation().contains('10% Performance bonus')
    jobDetailsPage.workPattern().contains('Flexi-time')
    jobDetailsPage.contractType().contains('Permanent')
    jobDetailsPage.hoursPerWeek().contains('Full-time (more than 40 hours)')
    jobDetailsPage.charityName().contains('Heart foundation')
    jobDetailsPage.numberOfVacancies().contains('1')
    jobDetailsPage.essentialCriteria().contains('Valid forklift operator certification or licence')
    jobDetailsPage.desirableCriteria().contains('Immediate starts available')
    jobDetailsPage.description().contains('Manoeuvring forklifts safely in busy industrial environments')
    jobDetailsPage.offenceExclusions().contains('Arson')
    jobDetailsPage.offenceExclusions().contains('Terrorism')
    jobDetailsPage.offenceExclusions().contains('Other - Some other exclusions')
    jobDetailsPage.closingDate().contains('1 Feb 2025')
    jobDetailsPage.isOnlyForPrisonLeavers().contains('Yes')
  })

  it('View job details - check loaded content', () => {
    cy.signIn()
    cy.visit('/mjma/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')
    jobDetailsPage.createArchiveRecordButton().click()

    jobDetailsPage.employerName().contains('ASDA')
    jobDetailsPage.jobTitle().contains('Warehouse operator')
  })
})
