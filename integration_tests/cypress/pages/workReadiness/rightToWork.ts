import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class RightToWorkPage extends Page {
  radioField = (): PageElement => cy.get('#rightToWork')

  radioFieldYes = (): PageElement => cy.get('[value=YES]')

  radioFieldNo = (): PageElement => cy.get('[value=NO]')

  pageErrorMessage = (): PageElement => cy.get('[href="#rightToWork"]')

  fieldErrorMessage = (): PageElement => cy.get('#rightToWork-error')
}
