/* eslint-disable @typescript-eslint/no-unused-vars */
import NewStatusPage from '../../pages/workReadiness/newStatus'
import NewStatusPausePage from '../../pages/workReadiness/newStatusPause'
import WorkProfilePage from '../../pages/workProfile'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserRoles')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('getStaffDetails')
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
    cy.task('updateProfile')
    cy.signIn()
  })

  it('Change to - SUPPORT_NEEDED', () => {
    cy.task('getPrisonerByCaseLoadIdAndOffenderId', 'G6115VJ')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getCurrentOffenderActivities', 'G6115VJ')
    cy.task('getKeyworker', 'G6115VJ')
    cy.task('getUnacceptableAbsenceCount', 'G6115VJ')
    cy.task('getPomForOffender', 'G6115VJ')
    cy.task('getCommunityManager', 'G6115VJ')

    cy.visit('/wr/profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Test User1's work profile")
    workProfilePage.overviewChangeStatusLink().click()

    const newStatusPage = new NewStatusPage()
    newStatusPage.radioFieldValue('SUPPORT_NEEDED').click()
    newStatusPage.submitButton().click()

    const newStatusPausePage = new NewStatusPausePage("You must now complete Test User1's work assessment")
    cy.contains('.govuk-link', 'Return to profile').should($a => {
      expect($a, $a.parent().parent().text()).to.have.attr('href', '/wr/profile/G6115VJ/view/overview')
    })
    newStatusPausePage.submitButton().click()
    cy.url().should('include', 'already-in-place/new')
  })

  it('Change to - NO_RIGHT_TO_WORK', () => {
    cy.task('getPrisonerByCaseLoadIdAndOffenderId', 'H4115SD')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('updateProfile', 'H4115SD')
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')
    cy.task('getCommunityManager', 'H4115SD')

    cy.visit('/wr/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Test User1's work profile")
    workProfilePage.overviewChangeStatusLink().click()

    const newStatusPage = new NewStatusPage()
    newStatusPage.radioFieldValue('NO_RIGHT_TO_WORK').click()
    newStatusPage.submitButton().click()

    cy.url().should('include', '/wr/profile/H4115SD/view/overview')
  })

  it('Change to - READY_TO_WORK', () => {
    cy.task('getPrisonerByCaseLoadIdAndOffenderId', 'H4115SD')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('updateProfile', 'H4115SD')
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')
    cy.task('getCommunityManager', 'H4115SD')

    cy.visit('/wr/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Test User1's work profile")
    workProfilePage.overviewChangeStatusLink().click()

    const newStatusPage = new NewStatusPage()
    newStatusPage.radioFieldValue('READY_TO_WORK').click()
    newStatusPage.submitButton().click()

    cy.url().should('include', '/wr/profile/H4115SD/view/overview')
  })

  it('Change to - SUPPORT_DECLINED', () => {
    cy.task('getPrisonerByCaseLoadIdAndOffenderId', 'H4115SD')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')
    cy.task('getCommunityManager', 'H4115SD')

    cy.visit('/wr/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Test User1's work profile")
    workProfilePage.overviewChangeStatusLink().click()

    const newStatusPage = new NewStatusPage()
    newStatusPage.radioFieldValue('SUPPORT_DECLINED').click()
    newStatusPage.submitButton().click()

    cy.url().should('include', 'support-declined-reason/new')
  })
})
