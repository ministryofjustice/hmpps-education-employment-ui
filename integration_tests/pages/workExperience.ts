import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class EWorkExperiencePage extends Page {
  constructor() {
    super('Does Daniel Craig have any previous work or volunteering experience?')
  }

  radioField = (): PageElement => cy.get('#workExperience')

  radioFieldValue = (value): PageElement => cy.get(`[value=${value}]`)

  textareaField = (): PageElement => cy.get('#workExperience')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  radioPageErrorMessage = (): PageElement => cy.get('[href="#workExperience"]')

  radioFieldErrorMessage = (): PageElement => cy.get('#workExperience-error')

  detailsPageErrorMessage = (): PageElement => cy.get('[href="#workExperienceDetails"]')

  detailsFieldErrorMessage = (): PageElement => cy.get('#workExperienceDetails-error')
}
