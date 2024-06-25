import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class PrisonerListMatchJobsPage extends Page {
  prisonerNameFilter = (): PageElement => cy.get('#prisonerNameFilter')

  showNeedsSupportFilter = (): PageElement => cy.get('#showNeedsSupportFilter')

  typeOfWorkFilter = (): PageElement => cy.get('#typeOfWork')

  matchJobsTab = (): PageElement => cy.get('#tab-match-jobs')

  manageApplicationsTab = (): PageElement => cy.get('#tab-manage-applications')

  applyFiltersLink = (): PageElement => cy.get('#applyFiltersButton')

  clearFiltersLink = (): PageElement => cy.get('#filter-clear-link')

  noResultsMessage = (): PageElement => cy.get('#no-results-message')

  lastNameSortLink = (): PageElement => cy.get('#lastName-sort-link')

  releaseDateSortLink = (): PageElement => cy.get('# releaseDate-sort-link')
}
