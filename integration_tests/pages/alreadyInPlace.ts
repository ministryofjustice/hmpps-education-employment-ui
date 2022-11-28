import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class AlreadyInPlacePage extends Page {
  constructor() {
    super('What does Daniel Craig have in place already?')
  }

  checkboxField = (): PageElement => cy.get('#alreadyInPlace')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#alreadyInPlace')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#alreadyInPlace"]')

  fieldErrorMessage = (): PageElement => cy.get('#alreadyInPlace-error')

  backLink = (): PageElement => cy.get('.govuk-back-link')
}
