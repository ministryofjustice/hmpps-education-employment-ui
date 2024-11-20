import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class ManageApplicationPage extends Page {
  jobTitle = (): PageElement => cy.get('[data-qa=job-title]')

  employerName = (): PageElement => cy.get('[data-qa=employer-name]')

  jobLocation = (): PageElement => cy.get('[data-qa=job-location]')

  closingDate = (): PageElement => cy.get('[data-qa=closing-date]')

  howToApply = (): PageElement => cy.get('[data-qa=how-to-apply]')

  updateProgressButton = (): PageElement => cy.get('#update-progress-link')

  applicationStatus = (): PageElement => cy.get('#applicationStatus')

  additionalInformation = (): PageElement => cy.get('#additionalInformation')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')
}
