import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class IdentificationPage extends Page {
  constructor() {
    super('What type of ID does Daniel Craig have?')
  }

  checkboxField = (): PageElement => cy.get('#identification')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#identification')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#identification"]')

  fieldErrorMessage = (): PageElement => cy.get('#identification-error')
}
