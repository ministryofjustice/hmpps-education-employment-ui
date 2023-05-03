import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class AlreadyInPlacePage extends Page {
  checkboxField = (): PageElement => cy.get('#alreadyInPlace')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#alreadyInPlace')

  pageErrorMessage = (): PageElement => cy.get('[href="#alreadyInPlace"]')

  fieldErrorMessage = (): PageElement => cy.get('#alreadyInPlace-error')
}
