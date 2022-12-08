import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class cohortList extends Page {
  constructor() {
    super('Change work status')
  }

  radioField = (): PageElement => cy.get('#newStatus')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#newStatus')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#newStatus"]')

  fieldErrorMessage = (): PageElement => cy.get('#newStatus-error')

  backLink = (): PageElement => cy.get('.govuk-back-link')
}
