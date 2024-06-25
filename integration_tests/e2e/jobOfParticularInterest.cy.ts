import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'
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
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit('/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Daniel Craig want support to get work?')
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()

    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')
    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()

    const abilityToWork = new AbilityToWorkPage("What might affect Daniel Craig's ability to work?")
    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.submitButton().click()

    const typeOfWork = new TypeOfWorkPage('What type of work is Daniel Craig interested in?')
    typeOfWork.checkboxFieldValue('CONSTRUCTION').click()
    typeOfWork.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Daniel Craig interested in a particular job?')

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
    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Daniel Craig interested in a particular job?')

    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()

    cy.url().should('include', 'work-experience/new')
  })

  it('Existing record - Select NO - navigates to check-answers page', () => {
    cy.visit('/profile/create/G6115VJ/job-of-particular-interest/edit')

    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Daniel Craig interested in a particular job?')

    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
