/* eslint-disable @typescript-eslint/no-unused-vars */
import EditActionPage from '../pages/editAction'
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
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('getStaffDetails')
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
    cy.task('updateProfile')
    cy.signIn()
  })

  it('Edit action - basic update', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('updateProfile', 'H4115SD')
    cy.task('getNotes', { id: 'H4115SD', toDoItem: 'BANK_ACCOUNT' })
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')
    cy.task('getCommunityManager', 'H4115SD')

    cy.visit('/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
    workProfilePage.editActionLink('BANK_ACCOUNT').click()

    const editActionPage = new EditActionPage('Bank account')
    editActionPage.radioFieldValue('IN_PROGRESS').click()

    editActionPage.submitButton().click()

    cy.url().should('include', '/profile/H4115SD/view/overview')
  })

  it('Edit action - add note', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('updateProfile', 'H4115SD')
    cy.task('getNotes', { id: 'H4115SD', toDoItem: 'BANK_ACCOUNT' })
    cy.task('addNote', { id: 'H4115SD', toDoItem: 'BANK_ACCOUNT' })
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')
    cy.task('getCommunityManager', 'H4115SD')

    cy.visit('/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
    workProfilePage.editActionLink('BANK_ACCOUNT').click()

    const editActionPage = new EditActionPage('Bank account')
    editActionPage.addNoteLink().click()

    editActionPage.addNoteButton().click()

    editActionPage.pageErrorMessage().contains('Add or cancel your note before trying to save progress')
    editActionPage.fieldErrorMessage().contains('Add or cancel your note before trying to save progress')

    editActionPage.submitButton().click()

    editActionPage.pageErrorMessage().contains('Add or cancel your note before trying to save progress')
    editActionPage.fieldErrorMessage().contains('Add or cancel your note before trying to save progress')

    editActionPage.textareaField().type('Some value')
    editActionPage.addNoteButton().click()
    editActionPage.submitButton().click()

    cy.url().should('include', '/profile/H4115SD/view/overview')
  })

  it('Edit action - ID field is displayed', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')
    cy.task('updateProfile', 'H4115SD')
    cy.task('getNotes', { id: 'H4115SD', toDoItem: 'ID' })
    cy.task('addNote', { id: 'H4115SD', toDoItem: 'ID' })
    cy.task('getCurrentOffenderActivities', 'H4115SD')
    cy.task('getKeyworker', 'H4115SD')
    cy.task('getUnacceptableAbsenceCount', 'H4115SD')
    cy.task('getPomForOffender', 'H4115SD')
    cy.task('getCommunityManager', 'H4115SD')

    cy.visit('/profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
    workProfilePage.editActionLink('ID').click()

    const editActionPage = new EditActionPage('ID')
    editActionPage.checkboxFieldValue('PASSPORT').click()

    editActionPage.submitButton().click()

    cy.url().should('include', '/profile/H4115SD/view/overview')
  })
})
