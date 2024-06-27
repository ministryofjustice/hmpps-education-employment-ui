import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class EditActionPage extends Page {
  radioField = (): PageElement => cy.get('#toDoStatus')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  checkboxField = (): PageElement => cy.get('#identification')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#noteText')

  addNoteLink = (): PageElement => cy.get('[data-qa=add-note-link]')

  addNoteButton = (): PageElement => cy.get('[data-qa=add-note-button]')

  pageErrorMessage = (): PageElement => cy.get('[href="#noteText"]')

  fieldErrorMessage = (): PageElement => cy.get('#noteText-error')
}
