import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class TrainingAndQualificationsPage extends Page {
  checkboxField = (): PageElement => cy.get('#trainingAndQualifications')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#trainingAndQualificationsDetails')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#trainingAndQualifications"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#trainingAndQualifications-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#trainingAndQualificationsDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#trainingAndQualificationsDetails-error')
}
