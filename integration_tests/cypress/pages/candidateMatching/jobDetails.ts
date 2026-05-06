import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobDetailsPage extends Page {
  backLinkUrl() {
    return cy.get('.govuk-back-link')
  }

  employerName = (): PageElement => cy.get('#employerName')

  jobTitle = (): PageElement => cy.get('#jobTitle')

  sector = (): PageElement => cy.get('#sector')

  postcode = (): PageElement => cy.get('#postcode')

  salaryFrom = (): PageElement => cy.get('#salaryFrom')

  salaryTo = (): PageElement => cy.get('#salaryTo')

  salaryPeriod = (): PageElement => cy.get('#salaryPeriod')

  additionalSalaryInformation = (): PageElement => cy.get('#additionalSalaryInformation')

  workPattern = (): PageElement => cy.get('#workPattern')

  contractType = (): PageElement => cy.get('#contractType')

  hoursPerWeek = (): PageElement => cy.get('#hoursPerWeek')

  essentialCriteria = (): PageElement => cy.get('#essentialCriteria')

  desirableCriteria = (): PageElement => cy.get('#desirableCriteria')

  description = (): PageElement => cy.get('#description')

  offenceExclusions = (): PageElement => cy.get('#offenceExclusions')

  howToApply = (): PageElement => cy.get('#howToApply')

  closingDate = (): PageElement => cy.get('#closingDate')

  startDate = (): PageElement => cy.get('#startDate')

  charityName = (): PageElement => cy.get('#charityName')

  numberOfVacancies = (): PageElement => cy.get('#numberOfVacancies')

  isOnlyForPrisonLeavers = (): PageElement => cy.get('#isOnlyForPrisonLeavers')

  createArchiveRecordButton = (): PageElement => cy.get('[data-qa=create-archive-record-button]')

  manageApplicationsButton = (): PageElement => cy.get('#manage-applications-button')
}
