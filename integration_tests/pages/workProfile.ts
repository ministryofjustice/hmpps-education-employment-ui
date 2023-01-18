import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WorkProfilePage extends Page {
  changeStatusLink = (): PageElement => cy.get('[data-qa=change-status-link]')
}
