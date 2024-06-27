import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class ManageDrugsAndAlcoholPage extends Page {
  radioField = (): PageElement => cy.get('#manageDrugsAndAlcohol')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#manageDrugsAndAlcohol')

  pageErrorMessage = (): PageElement => cy.get('[href="#manageDrugsAndAlcohol"]')

  fieldErrorMessage = (): PageElement => cy.get('#manageDrugsAndAlcohol-error')
}
