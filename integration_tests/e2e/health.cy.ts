context('Healthcheck', () => {
  context('All healthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubTokenVerificationPing')
      cy.task('stubPrisonApiPing')
      cy.task('stubNomisUserRolesApiPing')
      cy.task('stubPing')
    })

    it('Health check is accessible and status is UP', () => {
      cy.request('/health').its('body.status').should('equal', 'UP')
    })

    it('Health check does not include unmonitored APIs', () => {
      cy.request('/health').then(response => {
        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('UP')
        // unmonitored APIs
        expect(response.body.components.curiousApi).to.equal(undefined)
        expect(response.body.components.allocationManagerApi).to.equal(undefined)
      })
    })

    it('Ping is accessible and status is UP', () => {
      cy.request('/ping').its('body.status').should('equal', 'UP')
    })

    it('Info is accessible', () => {
      cy.request('/info').its('body.build.name').should('equal', 'hmpps-education-employment-ui')
    })
  })

  context('Some unhealthy', () => {
    it('Reports correctly when token verification down', () => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubTokenVerificationPing', 500)
      cy.task('stubPrisonApiPing')
      cy.task('stubNomisUserRolesApiPing')
      cy.task('stubPing')

      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.status).to.equal(500)
        expect(response.body.status).to.equal('DOWN')
        // healthy APIs
        expect(response.body.components.hmppsAuth.status).to.equal('UP')
        expect(response.body.components.hmppsPrisonApi.status).to.equal('UP')
        expect(response.body.components.prisonerSearch.status).to.equal('UP')
        expect(response.body.components.prisonerEducationProfile.status).to.equal('UP')
        expect(response.body.components.nomisUserRolesApi.status).to.equal('UP')
        expect(response.body.components.esweProfileApi.status).to.equal('UP')
        expect(response.body.components.keyworkerApi.status).to.equal('UP')
        expect(response.body.components.whereaboutsApi.status).to.equal('UP')
        expect(response.body.components.deliusIntegrationApi.status).to.equal('UP')
        expect(response.body.components.manageUsersApi.status).to.equal('UP')
        expect(response.body.components.jobApi.status).to.equal('UP')
        // unhealthy API
        expect(response.body.components.tokenVerification.status).to.equal('DOWN')
        expect(response.body.components.tokenVerification.details).to.contain({ status: 500, attempts: 3 })
      })
    })
  })
})
