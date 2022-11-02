import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class ManageDrugsAndAlcoholPage extends Page {
  constructor() {
    super('Is Daniel Craig currently able to manage their drug or alcohol dependency?')
  }

  checkboxField = (): PageElement => cy.get('#manageDrugsAndAlcohol')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#manageDrugsAndAlcohol')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#manageDrugsAndAlcohol"]')

  fieldErrorMessage = (): PageElement => cy.get('#manageDrugsAndAlcohol-error')
}
