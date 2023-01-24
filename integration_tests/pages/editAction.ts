import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class EditActionPage extends Page {
  constructor(title) {
    super(title)
  }

  radioField = (): PageElement => cy.get('#toDoStatus')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  checkboxField = (): PageElement => cy.get('#identification')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#noteText')

  backLink = (): PageElement => cy.get('.govuk-back-link')

  addNoteLink = (): PageElement => cy.get('[data-qa=add-note-link]')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  addNoteButton = (): PageElement => cy.get('[data-qa=add-note-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#noteText"]')

  fieldErrorMessage = (): PageElement => cy.get('#noteText-error')
}
