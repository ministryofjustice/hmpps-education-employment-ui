import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class abilityToWorkPage extends Page {
  constructor() {
    super("What might affect Daniel Craig's ability to work?")
  }

  checkboxField = (): PageElement => cy.get('#abilityToWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#abilityToWork')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#abilityToWork"]')

  fieldErrorMessage = (): PageElement => cy.get('#abilityToWork-error')
}
