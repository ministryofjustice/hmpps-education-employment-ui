import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class NewStatusPausePage extends Page {
  profileLink = (): PageElement => cy.get('.govuk-button-group .govuk-link')
}
