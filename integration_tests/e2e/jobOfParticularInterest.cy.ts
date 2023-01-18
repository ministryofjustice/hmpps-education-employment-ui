import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'
import TypeOfWorkPage from '../pages/typeOfWork'
import JobOfParticularInterestPage from '../pages/jobOfParticularInterest'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })
    cy.signIn()
    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')
    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()
    const supportOptIn = Page.verifyOnPage(SupportOptIn)
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()
    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)
    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()
    const abilityToWork = Page.verifyOnPage(AbilityToWorkPage)
    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.submitButton().click()
    const typeOfWork = Page.verifyOnPage(TypeOfWorkPage)
    typeOfWork.checkboxFieldValue('CONSTRUCTION').click()
    typeOfWork.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const jobOfParticularInterest = Page.verifyOnPage(JobOfParticularInterestPage)

    jobOfParticularInterest.submitButton().click()

    jobOfParticularInterest
      .radioPageErrorMessage()
      .contains('Select if Daniel Craig is interested in a particular job or not')
    jobOfParticularInterest
      .radioFieldErrorMessage()
      .contains('Select if Daniel Craig is interested in a particular job or not')

    jobOfParticularInterest.radioFieldValue('YES').click()
    jobOfParticularInterest.submitButton().click()

    jobOfParticularInterest.detailsPageErrorMessage().contains('Enter the particular job Daniel Craig is interested in')
    jobOfParticularInterest
      .detailsFieldErrorMessage()
      .contains('Enter the particular job Daniel Craig is interested in')
  })

  it('New record - Select NO - navigates to work-experience page', () => {
    const jobOfParticularInterest = Page.verifyOnPage(JobOfParticularInterestPage)

    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()

    cy.url().should('include', 'work-experience/new')
  })

  it('Existing record - Select NO - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/job-of-particular-interest/edit')

    const jobOfParticularInterest = Page.verifyOnPage(JobOfParticularInterestPage)

    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
