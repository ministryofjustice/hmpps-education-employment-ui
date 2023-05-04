import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class SupportOptInPage extends Page {
  radioField = (): PageElement => cy.get('#supportOptIn')

  radioFieldYes = (): PageElement => cy.get('[value=YES]')

  radioFieldNo = (): PageElement => cy.get('[value=NO]')

  pageErrorMessage = (): PageElement => cy.get('[href="#supportOptIn"]')

  fieldErrorMessage = (): PageElement => cy.get('#supportOptIn-error')
}
