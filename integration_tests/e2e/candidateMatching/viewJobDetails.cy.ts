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
    cy.task('getJob')
    cy.task('getEmployer')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')
    cy.signIn()
  })

  it('View job details - check loaded content', () => {
    cy.visit('/cms/G6115VJ/job/0190a227-be75-7009-8ad6-c6b068b6754e/details')

    const jobDetailsPage = new JobDetailsPage('Warehouse operator')

    jobDetailsPage.employerName().contains('ASDA')
    jobDetailsPage.jobTitle().contains('Warehouse operator')
    jobDetailsPage.sector().contains('Warehousing and storage')
    jobDetailsPage.postCode().contains('NE236DR')
    jobDetailsPage.salaryFrom().contains('£25000.00')
    jobDetailsPage.salaryTo().contains('£30000.00')
    jobDetailsPage.salaryPeriod().contains('Per year')
    jobDetailsPage.workPattern().contains('Flexi-time')
    jobDetailsPage.contractType().contains('Permanent')
    jobDetailsPage.hoursPerWeek().contains('Full-time (more than 40 hours)')
    jobDetailsPage.essentialCriteria().contains('Valid forklift operator certification or licence')
    jobDetailsPage.desirableCriteria().contains('Immediate starts available')
    jobDetailsPage.description().contains('Manoeuvring forklifts safely in busy industrial environments')
    jobDetailsPage.offenceExclusions().contains('Arson')
    jobDetailsPage.offenceExclusions().contains('Terrorism')
    jobDetailsPage.closingDate().contains('1 Feb 2025')
    jobDetailsPage.startDate().contains('1 Jun 2025')
  })
})
