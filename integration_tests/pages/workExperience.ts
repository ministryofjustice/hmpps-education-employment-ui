import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WorkExperiencePage extends Page {
  radioField = (): PageElement => cy.get('#workExperience')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#workExperienceDetails')

  radioPageErrorMessage = (): PageElement => cy.get('[href="#workExperience"]')

  radioFieldErrorMessage = (): PageElement => cy.get('#workExperience-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#workExperienceDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#workExperienceDetails-error')
}
