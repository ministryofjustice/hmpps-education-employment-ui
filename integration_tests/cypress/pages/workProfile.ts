import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WorkProfilePage extends Page {
  profileViewNotAllowed = (): PageElement => cy.get('[data-qa=profile-view-not-allowed]')

  notFound = (): PageElement => cy.get('[data-qa=not-found]')

  tabOverview = (): PageElement => cy.get('[data-qa=tab-overview]')

  tabDetails = (): PageElement => cy.get('[data-qa=tab-details]')

  tabExperience = (): PageElement => cy.get('[data-qa=tab-experience]')

  tabContacts = (): PageElement => cy.get('[data-qa=tab-contacts]')

  tabTraining = (): PageElement => cy.get('[data-qa=tab-training]')

  overviewStatus = (): PageElement => cy.get('[data-qa=overview-status]')

  overviewCompleteAssessmentLink = (): PageElement => cy.get('#overview-assessment-link')

  overviewChangeStatusLink = (): PageElement => cy.get('#change-status-link')

  overviewDeclinedReasonLink = (): PageElement => cy.get('#overview-declined-reason-link')

  overviewDeclinedChangesRequiredLink = (): PageElement => cy.get('#overview-declined-changes-required-link')

  editActionLink = (toDoItem: string): PageElement => cy.get(`#overview-todo-${toDoItem}-link`)

  releaseArea = (): PageElement => cy.get('#prisoner-release-area')

  matchedJobsTab = (): PageElement => cy.get('#tab_matched-jobs')

  openApplicationsTab = (): PageElement => cy.get('#tab_open-applications')

  closedApplicationsTab = (): PageElement => cy.get('#tab_closed-applications')

  viewMatchedJobsLink = (): PageElement => cy.get('#view-matched-jobs-link')

  matchedJobsByIndexTitle = (index: number): PageElement => cy.get(`#jobs_matched_title_${index}`)

  matchedJobsByIndexEmployer = (index: number): PageElement => cy.get(`#jobs_matched_employer_${index}`)

  matchedJobsByIndexClosingDate = (index: number): PageElement => cy.get(`#jobs_matched_closing_date_${index}`)

  jobsOfInterestByIndexTitle = (index: number): PageElement => cy.get(`#jobs_of_interest_title_${index}`)

  jobsOfInterestByIndexEmployer = (index: number): PageElement => cy.get(`#jobs_of_interest_employer_${index}`)

  jobsOfInterestByIndexClosingDate = (index: number): PageElement => cy.get(`#jobs_of_interest_closing_date_${index}`)

  openApplicationByIndexJob = (index: number): PageElement => cy.get(`#open_application_job_${index}`)

  openApplicationByIndexEmployer = (index: number): PageElement => cy.get(`#open_application_employer_${index}`)

  openApplicationByIndexStatus = (index: number): PageElement => cy.get(`#open_application_status_${index}`)

  openApplicationByIndexViewDetailsLink = (index: number): PageElement => cy.get(`#view_open_application_${index}_link`)

  closedApplicationByIndexJob = (index: number): PageElement => cy.get(`#closed_application_job_${index}`)

  closedApplicationByIndexEmployer = (index: number): PageElement => cy.get(`#closed_application_employer_${index}`)

  closedApplicationByIndexStatus = (index: number): PageElement => cy.get(`#closed_application_status_${index}`)

  closedApplicationByIndexViewDetailsLink = (index: number): PageElement =>
    cy.get(`#view_closed_application_${index}_link`)

  matchedJobsClosingSoonTableData = () =>
    cy
      .get('#matchedJobs')
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            jobTitle: Cypress.$(tds[0]).text(),
            closingDate: Cypress.$(tds[1]).text(),
          }
        }),
      )

  jobsOfInterestTableData = () =>
    cy
      .get('#jobsOfInterest')
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            jobTitle: Cypress.$(tds[0]).text(),
            closingDate: Cypress.$(tds[1]).text(),
          }
        }),
      )

  openApplicationsTableData = () =>
    cy
      .get('#openApplications')
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            jobTitle: Cypress.$(tds[0]).text(),
            status: Cypress.$(tds[1]).text(),
            actions: Cypress.$(tds[2]).text(),
          }
        }),
      )

  closedApplicationsTableData = () =>
    cy
      .get('#closedApplications')
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            jobTitle: Cypress.$(tds[0]).text(),
            status: Cypress.$(tds[1]).text(),
            actions: Cypress.$(tds[2]).text(),
          }
        }),
      )
}
