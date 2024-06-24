import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class IdentificationPage extends Page {
  checkboxField = (): PageElement => cy.get('#identification')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#identification')

  pageErrorMessage = (): PageElement => cy.get('[href="#identification"]')

  fieldErrorMessage = (): PageElement => cy.get('#identification-error')
}
