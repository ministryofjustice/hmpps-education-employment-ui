import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class CheckYourAnswersPage extends Page {
  constructor() {
    super('Daniel Craig is not allowed to work in the UK')
  }

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')
}
