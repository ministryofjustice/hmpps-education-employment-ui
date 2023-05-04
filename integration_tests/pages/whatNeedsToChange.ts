import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WhatNeedsToChangePage extends Page {
  checkboxField = (): PageElement => cy.get('#whatNeedsToChange')

  checkboxFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#whatNeedsToChange')

  checkboxPageErrorMessage = (): PageElement => cy.get('[href="#whatNeedsToChange"]')

  checkboxFieldErrorMessage = (): PageElement => cy.get('#whatNeedsToChange-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#whatNeedsToChangeDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#whatNeedsToChangeDetails-error')
}
