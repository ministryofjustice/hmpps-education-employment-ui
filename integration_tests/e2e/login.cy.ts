/* eslint-disable @typescript-eslint/no-unused-vars */
import IndexPage from '../pages/index'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserRoles')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can log out', () => {
    cy.signIn()

    cy.checkFeatureToggle('candidateMatchingEnabled', isEnabled => {
      cy.wrap(isEnabled).as('candidateMatchingEnabled')
    })

    cy.get('@candidateMatchingEnabled').then(isEnabled => {
      if (isEnabled) {
        const indexPage = new IndexPage('Work after leaving prison')
        indexPage.signOut().click()
        Page.verifyOnPage(AuthSignInPage)
      } else {
        const indexPage = new IndexPage('Get someone ready to work')
        indexPage.signOut().click()
        Page.verifyOnPage(AuthSignInPage)
      }
    })
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()

    cy.checkFeatureToggle('candidateMatchingEnabled', isEnabled => {
      cy.wrap(isEnabled).as('candidateMatchingEnabled')
    })

    cy.get('@candidateMatchingEnabled').then(isEnabled => {
      if (isEnabled) {
        // Add more test steps for enabled feature
        const indexPage = new IndexPage('Work after leaving prison')
        cy.task('stubVerifyToken', false)

        // can't do a visit here as cypress requires only one domain
        cy.request('/').its('body').should('contain', 'Sign in')
      } else {
        const indexPage = new IndexPage('Get someone ready to work')
        cy.task('stubVerifyToken', false)

        // can't do a visit here as cypress requires only one domain
        cy.request('/').its('body').should('contain', 'Sign in')
      }
    })
  })
})
