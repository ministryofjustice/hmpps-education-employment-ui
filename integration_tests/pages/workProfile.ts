import Page from './page'
import TrainingAndQualificationsPage from './trainingAndQualifications'

export type PageElement = Cypress.Chainable<JQuery>

export default class WorkProfilePage extends Page {
  changeStatusLink = (): PageElement => cy.get('[data-qa=change-status-link]')

  tabOverview = (): PageElement => cy.get('[data-qa=tab-overview]')

  tabDetails = (): PageElement => cy.get('[data-qa=tab-details]')

  tabExperience = (): PageElement => cy.get('[data-qa=tab-experience]')

  tabContacts = (): PageElement => cy.get('[data-qa=tab-contacts]')

  tabTraining = (): PageElement => cy.get('[data-qa=tab-training]')
}
