import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WhatNeedsToChangePage extends Page {
  checkboxField = (): PageElement => cy.get('#whatNeedsToChange')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#whatNeedsToChange')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#whatNeedsToChange"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#whatNeedsToChange-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#whatNeedsToChangeDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#whatNeedsToChangeDetails-error')

  backLink = (): PageElement => cy.get('.govuk-back-link')
}
