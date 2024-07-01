declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to signIn. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.signIn({ failOnStatusCode: boolean })
     */
    signIn(options?: { failOnStatusCode: boolean }): Chainable<AUTWindow>

    /**
     * Custom command to check if a feature is enabled.
     * @example cy.checkFeatureToggle('candidateMatchingEnabled', (isEnabled) => { ... })
     */
    checkFeatureToggle(featureName: string, callback: (isEnabled: boolean) => void): Chainable<void>
  }
}
