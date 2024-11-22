import Page from '../page'

export type PageElement = Cypress.Chainable<JQuery>

export default class MatchedJobsPage extends Page {
  matchedJobsClosingSoonTableData = () =>
    cy
      .get('#matchedJobs')
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            jobTitle: Cypress.$(tds[0]).text(),
            closingDate: Cypress.$(tds[1]).text(),
          }
        }),
      )
}
