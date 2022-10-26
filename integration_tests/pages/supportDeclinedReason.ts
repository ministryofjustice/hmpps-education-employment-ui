import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class SupportDeclinedReasonPage extends Page {
  constructor() {
    super('Why does Daniel Craig not want support?')
  }

  checkboxField = (): PageElement => cy.get('#supportDeclinedReason')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#supportDeclinedReason')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  reasonPageErrorMessage = (): PageElement => cy.get('[href="#supportDeclinedReason"]')

  reasonFieldErrorMessage = (): PageElement => cy.get('#supportDeclinedReason-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#supportDeclinedDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#supportDeclinedDetails-error')
}
