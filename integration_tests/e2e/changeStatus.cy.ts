/* eslint-disable @typescript-eslint/no-unused-vars */
import NewStatusPage from '../pages/newStatus'
import NewStatusPausePage from '../pages/newStatusPause'
import Page from '../pages/page'
import WorkProfilePage from '../pages/workProfile'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('updateProfile')
    cy.signIn()
  })

  it('Change to - SUPPORT_NEEDED', () => {
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')

    cy.visit('/work-profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")
    workProfilePage.changeStatusLink().click()

    const newStatusPage = Page.verifyOnPage(NewStatusPage)
    newStatusPage.radioFieldValue('SUPPORT_NEEDED').click()
    newStatusPage.submitButton().click()

    const newStatusPausePage = Page.verifyOnPage(NewStatusPausePage)
    newStatusPausePage.submitButton().click()
    cy.url().should('include', 'already-in-place/new')
  })

  it('Change to - NO_RIGHT_TO_WORK', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('updateProfile', 'H4115SD')

    cy.visit('/work-profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
    workProfilePage.changeStatusLink().click()

    const newStatusPage = Page.verifyOnPage(NewStatusPage)
    newStatusPage.radioFieldValue('NO_RIGHT_TO_WORK').click()
    newStatusPage.submitButton().click()

    cy.url().should('include', '/work-profile/H4115SD/view/overview')
  })

  it('Change to - READY_TO_WORK', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('updateProfile', 'H4115SD')

    cy.visit('/work-profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
    workProfilePage.changeStatusLink().click()

    const newStatusPage = Page.verifyOnPage(NewStatusPage)
    newStatusPage.radioFieldValue('READY_TO_WORK').click()
    newStatusPage.submitButton().click()

    cy.url().should('include', '/work-profile/H4115SD/view/overview')
  })

  it('Change to - SUPPORT_DECLINED', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')

    cy.visit('/work-profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
    workProfilePage.changeStatusLink().click()

    const newStatusPage = Page.verifyOnPage(NewStatusPage)
    newStatusPage.radioFieldValue('SUPPORT_DECLINED').click()
    newStatusPage.submitButton().click()

    cy.url().should('include', 'support-declined-reason/new')
  })
})
