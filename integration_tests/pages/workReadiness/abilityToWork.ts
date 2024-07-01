import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class abilityToWorkPage extends Page {
  checkboxField = (): PageElement => cy.get('#abilityToWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#abilityToWork')

  pageErrorMessage = (): PageElement => cy.get('[href="#abilityToWork"]')

  fieldErrorMessage = (): PageElement => cy.get('#abilityToWork-error')
}
