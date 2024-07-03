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

  it('User name visible in header', () => {
    cy.signIn()

    cy.checkFeatureToggle('candidateMatchingEnabled', isEnabled => {
      cy.wrap(isEnabled).as('candidateMatchingEnabled')
    })

    cy.get('@candidateMatchingEnabled').then(isEnabled => {
      if (isEnabled) {
        const indexPage = new IndexPage('Work after release')
        cy.get('[data-qa=header-user-name]').should('contain.text', 'J. Smith')
      } else {
        const indexPage = new IndexPage('Get someone ready to work')
        cy.get('[data-qa=header-user-name]').should('contain.text', 'J. Smith')
      }
    })
  })

  it('User can log out', () => {
    cy.signIn()

    cy.checkFeatureToggle('candidateMatchingEnabled', isEnabled => {
      cy.wrap(isEnabled).as('candidateMatchingEnabled')
    })

    cy.get('@candidateMatchingEnabled').then(isEnabled => {
      if (isEnabled) {
        const indexPage = new IndexPage('Work after release')
        indexPage.signOut().click()
        Page.verifyOnPage(AuthSignInPage)
      } else {
        const indexPage = new IndexPage('Get someone ready to work')
        indexPage.signOut().click()
        Page.verifyOnPage(AuthSignInPage)
      }
    })
  })

  it('User can manage their details', () => {
    cy.signIn()

    cy.checkFeatureToggle('candidateMatchingEnabled', isEnabled => {
      cy.wrap(isEnabled).as('candidateMatchingEnabled')
    })

    cy.get('@candidateMatchingEnabled').then(isEnabled => {
      if (isEnabled) {
        const indexPage = new IndexPage('Work after release')

        indexPage.manageDetails().get('a').invoke('removeAttr', 'target')
        indexPage.manageDetails().click()
        Page.verifyOnPage(AuthManageDetailsPage)
      } else {
        const indexPage = new IndexPage('Get someone ready to work')

        indexPage.manageDetails().get('a').invoke('removeAttr', 'target')
        indexPage.manageDetails().click()
        Page.verifyOnPage(AuthManageDetailsPage)
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
        const indexPage = new IndexPage('Work after release')
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

  it('Token verification failure clears user session', () => {
    cy.signIn()

    cy.checkFeatureToggle('candidateMatchingEnabled', isEnabled => {
      cy.wrap(isEnabled).as('candidateMatchingEnabled')
    })

    cy.get('@candidateMatchingEnabled').then(isEnabled => {
      if (isEnabled) {
        const indexPage = new IndexPage('Work after release')
        cy.task('stubVerifyToken', false)

        // can't do a visit here as cypress requires only one domain
        cy.request('/').its('body').should('contain', 'Sign in')

        cy.task('stubVerifyToken', true)
        cy.task('stubAuthUser', 'bobby brown')
        cy.signIn()

        indexPage.headerUserName().contains('B. Brown')
      } else {
        const indexPage = new IndexPage('Get someone ready to work')
        cy.task('stubVerifyToken', false)

        // can't do a visit here as cypress requires only one domain
        cy.request('/').its('body').should('contain', 'Sign in')

        cy.task('stubVerifyToken', true)
        cy.task('stubAuthUser', 'bobby brown')
        cy.signIn()

        indexPage.headerUserName().contains('B. Brown')
      }
    })
  })
})
