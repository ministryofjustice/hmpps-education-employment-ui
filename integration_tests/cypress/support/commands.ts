/// <reference types="cypress" />

Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('checkFeatureToggle', (featureName: string, callback: (isEnabled: boolean) => void) => {
  cy.request('/api/features-enabled').then(response => {
    expect(response.status).to.eq(200)

    const isFeatureEnabled = response.body[featureName]
    expect(isFeatureEnabled).to.be.a('boolean')

    callback(isFeatureEnabled)
  })
})
