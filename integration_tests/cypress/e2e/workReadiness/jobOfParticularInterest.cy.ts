import RightToWorkPage from '../../pages/workReadiness/rightToWork'
import SupportOptInPage from '../../pages/workReadiness/supportOptIn'
import AlreadyInPlacePage from '../../pages/workReadiness/alreadyInPlace'
import AbilityToWorkPage from '../../pages/workReadiness/abilityToWork'
import TypeOfWorkPage from '../../pages/workReadiness/typeOfWork'
import JobOfParticularInterestPage from '../../pages/candidateMatching/jobOfParticularInterest'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserRoles')
    cy.task('getPrisonerById')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit('/wr/profile/create/G6115VJ/right-to-work/new')

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Test User1 want support to get work?')
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()

    const alreadyInPlace = new AlreadyInPlacePage('What does Test User1 have in place already?')
    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()

    const abilityToWork = new AbilityToWorkPage("What might affect Test User1's ability to work?")
    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.submitButton().click()

    const typeOfWork = new TypeOfWorkPage('What type of work is Test User1 interested in?')
    typeOfWork.checkboxFieldValue('CONSTRUCTION').click()
    typeOfWork.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Test User1 interested in a particular job?')

    jobOfParticularInterest.submitButton().click()

    jobOfParticularInterest
      .radioPageErrorMessage()
      .contains('Select if Test User1 is interested in a particular job or not')
    jobOfParticularInterest
      .radioFieldErrorMessage()
      .contains('Select if Test User1 is interested in a particular job or not')

    jobOfParticularInterest.radioFieldValue('YES').click()
    jobOfParticularInterest.submitButton().click()

    jobOfParticularInterest.detailsPageErrorMessage().contains('Enter the particular job Test User1 is interested in')
    jobOfParticularInterest.detailsFieldErrorMessage().contains('Enter the particular job Test User1 is interested in')
  })

  it('New record - Select NO - navigates to work-experience page', () => {
    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Test User1 interested in a particular job?')

    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()

    cy.url().should('include', 'work-experience/new')
  })

  it('Existing record - Select NO - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/job-of-particular-interest/edit')

    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Test User1 interested in a particular job?')

    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
