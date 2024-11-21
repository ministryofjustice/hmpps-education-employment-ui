import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class ManageApplicationPage extends Page {
  jobTitle = (): PageElement => cy.get('[data-qa=job-title]')

  employerName = (): PageElement => cy.get('[data-qa=employer-name]')

  jobLocation = (): PageElement => cy.get('[data-qa=job-location]')

  closingDate = (): PageElement => cy.get('[data-qa=closing-date]')

  howToApply = (): PageElement => cy.get('[data-qa=how-to-apply]')

  updateProgressButton = (): PageElement => cy.get('#update-progress-link')

  applicationStatus = (): PageElement => cy.get('#applicationStatus')

  additionalInformation = (): PageElement => cy.get('#additionalInformation')

  applicationStatusPageErrorMessage = (): PageElement => cy.get('[href="#applicationStatus"]')

  applicationStatusFieldErrorMessage = (): PageElement => cy.get('#applicationStatus-error')

  submitButton = (): PageElement => cy.get('[data-qa=submit-button]')

  tableData = () =>
    cy
      .get('#applicationHistory')
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            status: Cypress.$(tds[0]).text(),
            moreInformation: Cypress.$(tds[1]).text(),
          }
        }),
      )
}
