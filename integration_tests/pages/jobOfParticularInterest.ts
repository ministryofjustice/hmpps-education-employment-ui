import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class JobOfParticularInterestPage extends Page {
  radioField = (): PageElement => cy.get('#jobOfParticularInterest')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#jobOfParticularInterestDetails')

  radioPageErrorMessage = (): PageElement => cy.get('[href="#jobOfParticularInterest"]')

  radioFieldErrorMessage = (): PageElement => cy.get('#jobOfParticularInterest-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#jobOfParticularInterestDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#jobOfParticularInterestDetails-error')
}
