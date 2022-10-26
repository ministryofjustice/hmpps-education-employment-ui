import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class RightToWorkPage extends Page {
  constructor() {
    super('Does Daniel Craig want support to get work?')
  }

  radioField = (): PageElement => cy.get('#supportOptIn')

  radioFieldYes = (): PageElement => cy.get('[value=YES]')

  radioFieldNo = (): PageElement => cy.get('[value=NO]')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#supportOptIn"]')

  fieldErrorMessage = (): PageElement => cy.get('#supportOptIn-error')
}
