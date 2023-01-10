import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class WorkProfilePage extends Page {
  tabOverview = (): PageElement => cy.get('[data-qa=tab-overview]')

  tabDetails = (): PageElement => cy.get('[data-qa=tab-details]')

  tabExperience = (): PageElement => cy.get('[data-qa=tab-experience]')

  tabContacts = (): PageElement => cy.get('[data-qa=tab-contacts]')

  tabTraining = (): PageElement => cy.get('[data-qa=tab-training]')

  overviewStatus = (): PageElement => cy.get('[data-qa=overview-status]')

  overviewCompleteAssessmentLink = (): PageElement => cy.get('#overview-assessment-link')

  overviewChangeStatusLink = (): PageElement => cy.get('#change-status-link')

  overviewDeclinedReasonLink = (): PageElement => cy.get('#overview-declined-reason-link')

  overviewDeclinedChangesRequiredLink = (): PageElement => cy.get('#overview-declined-changes-required-link')
}
