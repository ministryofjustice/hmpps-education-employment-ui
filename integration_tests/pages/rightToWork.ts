import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class RightToWorkPage extends Page {
  constructor() {
    super('Right to work in the UK')
  }

  radioField = (): PageElement => cy.get('#rightToWork')

  radioFieldYes = (): PageElement => cy.get('[value=YES]')

  radioFieldNo = (): PageElement => cy.get('[value=NO]')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#rightToWork"]')

  fieldErrorMessage = (): PageElement => cy.get('#rightToWork-error')
}
