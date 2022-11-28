import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class TrainingAndQualificationsPage extends Page {
  constructor() {
    super('Does Daniel Craig have any qualifications or training?')
  }

  checkboxField = (): PageElement => cy.get('#trainingAndQualifications')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#trainingAndQualificationsDetails')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#trainingAndQualifications"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#trainingAndQualifications-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#trainingAndQualificationsDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#trainingAndQualificationsDetails-error')

  backLink = (): PageElement => cy.get('.govuk-back-link')
}
