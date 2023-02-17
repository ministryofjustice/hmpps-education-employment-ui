/* eslint-disable @typescript-eslint/no-unused-vars */
import NewStatusPage from '../pages/newStatus'
import Page from '../pages/page'
import SupportDeclinedReasonPage from '../pages/supportDeclinedReason'
import WhatNeedsToChangePage from '../pages/whatNeedsToChange'
import WorkProfilePage from '../pages/workProfile'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('getStaffDetails')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
    cy.signIn()
  })

  it('No right to work', () => {
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getCurrentOffenderActivities', 'G6115VJ')
    cy.task('getKeyworker', 'G6115VJ')
    cy.task('getUnacceptableAbsenceCount', 'G6115VJ')
    cy.task('getPomForOffender', 'G6115VJ')

    cy.visit('/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")

    workProfilePage.overviewStatus().contains('NO RIGHT TO WORK')

    workProfilePage.overviewChangeStatusLink().contains('Change').click()

    const newStatusPage = Page.verifyOnPage(NewStatusPage)
  })

  it('Support Needed', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')

    cy.visit('/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
  })

  it('No support needed', () => {
    cy.task('getPrisonerById', 'G5005GD')
    cy.task('getProfileById', 'G5005GD')
    cy.task('getCurrentOffenderActivities', 'G5005GD')
    cy.task('getKeyworker', 'G5005GD')
    cy.task('getUnacceptableAbsenceCount', 'G5005GD')
    cy.task('getPomForOffender', 'G5005GD')

    cy.visit('/profile/G5005GD/view/overview')
    const workProfilePage = new WorkProfilePage("John Smith's work profile")

    workProfilePage.overviewDeclinedReasonLink().click()

    const supportDeclinedReason = new SupportDeclinedReasonPage('Why does John Smith not want support?')
    supportDeclinedReason.backLink().click()

    workProfilePage.overviewDeclinedChangesRequiredLink().click()

    const whatNeedsToChange = new WhatNeedsToChangePage(
      'What change in circumstances would make John Smith want to get work?',
    )
    whatNeedsToChange.backLink().click()

    cy.url().should('include', '/profile')
  })

  it('No profile found', () => {
    cy.task('getPrisonerById', 'A00001A')
    cy.task('getProfileById', 'A00001A')
    cy.task('getCurrentOffenderActivities', 'A00001A')
    cy.task('getKeyworker', 'A00001A')
    cy.task('getUnacceptableAbsenceCount', 'A00001A')
    cy.task('getPomForOffender', 'A00001A')

    cy.visit('/profile/A00001A/view/overview')
    const workProfilePage = new WorkProfilePage("Paris Jones's work profile")

    workProfilePage.overviewCompleteAssessmentLink().contains('Complete assessment now')
  })
})
