import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class IneligableToWorkPage extends Page {
  constructor() {
    super("You must now complete Daniel Craig's work assessment")
  }

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  backLink = (): PageElement => cy.get('.govuk-back-link')

  profileLink = (): PageElement => cy.get('.govuk-button-group .govuk-link')
}
