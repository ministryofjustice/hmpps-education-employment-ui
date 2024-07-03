import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class PrisonerListApplicationsPage extends Page {
  prisonerNameFilter = (): PageElement => cy.get('#prisonerNameFilter')

  jobFilter = (): PageElement => cy.get('#jobFilter')

  applicationStatusFilter = (): PageElement => cy.get('#applicationStatusFilter')

  matchJobsTab = (): PageElement => cy.get('#tab-match-jobs')

  manageApplicationsTab = (): PageElement => cy.get('#tab-manage-applications')

  applyFiltersLink = (): PageElement => cy.get('#applyFiltersButton')

  clearFiltersLink = (): PageElement => cy.get('#filter-clear-link')

  noResultsMessage = (): PageElement => cy.get('#no-results-message')

  lastNameSortLink = (): PageElement => cy.get('#lastName-sort-link')

  jobTitleSortLink = (): PageElement => cy.get('#jobTitle-sort-link')
}
