/* eslint-disable @typescript-eslint/no-unused-vars */
import WorkProfilePage from '../pages/workProfile'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.signIn()
  })

  it('No right to work', () => {
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getProfileById', 'G6115VJ')

    cy.visit('/work-profile/G6115VJ/view/overview')
    const workProfilePage = new WorkProfilePage("Daniel Craig's work profile")
  })

  it('Support Needed', () => {
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getProfileById', 'H4115SD')

    cy.visit('/work-profile/H4115SD/view/overview')
    const workProfilePage = new WorkProfilePage("Billy Jean's work profile")
  })

  it('No support needed', () => {
    cy.task('getPrisonerById', 'G5005GD')
    cy.task('getProfileById', 'G5005GD')

    cy.visit('/work-profile/G5005GD/view/overview')
    const workProfilePage = new WorkProfilePage("John Smith's work profile")
  })

  it('No profile found', () => {
    cy.task('getPrisonerById', 'A00001A')
    cy.task('getProfileById', 'A00001A')

    cy.visit('/work-profile/A00001A/view/overview')
    const workProfilePage = new WorkProfilePage("Paris Jones's work profile")
  })
})
