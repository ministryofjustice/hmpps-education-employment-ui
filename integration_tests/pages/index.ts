import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  courtRegisterLink = (): PageElement => cy.get('[href="/court-register"]')
}
