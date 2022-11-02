import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class TypeOfWorkPage extends Page {
  constructor() {
    super('What type of work is Daniel Craig interested in?')
  }

  checkboxField = (): PageElement => cy.get('#typeOfWork')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#typeOfWork')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#typeOfWork"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#typeOfWork-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#typeOfWorkDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#typeOfWorkDetails-error')
}
