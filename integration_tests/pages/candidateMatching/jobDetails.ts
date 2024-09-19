import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobDetailsPage extends Page {
  employerName = (): PageElement => cy.get('#employerName')

  jobTitle = (): PageElement => cy.get('#jobTitle')

  sector = (): PageElement => cy.get('#sector')

  postCode = (): PageElement => cy.get('#postCode')

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

  createArchiveRecordButton = (): PageElement => cy.get('[data-qa=create-archive-record-button]')
}
