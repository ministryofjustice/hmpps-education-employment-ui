import RightToWorkPage from '../../pages/workReadiness/rightToWork'
import SupportOptInPage from '../../pages/workReadiness/supportOptIn'
import AlreadyInPlacePage from '../../pages/workReadiness/alreadyInPlace'
import AbilityToWorkPage from '../../pages/workReadiness/abilityToWork'
import TypeOfWorkPage from '../../pages/workReadiness/typeOfWork'
import JobOfParticularInterestPage from '../../pages/candidateMatching/jobOfParticularInterest'
import WorkExperiencePage from '../../pages/workReadiness/workExperience'
import TrainingAndQualificationsPage from '../../pages/workReadiness/trainingAndQualifications'

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

    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Test User1 interested in a particular job?')
    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()

    const workExperience = new WorkExperiencePage('Does Test User1 have any previous work or volunteering experience?')
    workExperience.radioFieldValue('NO').click()
    workExperience.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const trainingAndQualifications = new TrainingAndQualificationsPage(
      'Does Test User1 have any qualifications or training?',
    )

    trainingAndQualifications.submitButton().click()

    trainingAndQualifications
      .checkboxPageErrorMessage()
      .contains('Select any qualifications or training Test User1 has')
    trainingAndQualifications
      .checkboxFieldErrorMessage()
      .contains('Select any qualifications or training Test User1 has')

    trainingAndQualifications.checkboxFieldValue('OTHER').click()
    trainingAndQualifications.submitButton().click()

    trainingAndQualifications
      .detailsPageErrorMessage()
      .contains('Enter details of the qualifications or training Test User1 has done')
    trainingAndQualifications
      .detailsFieldErrorMessage()
      .contains('Enter details of the qualifications or training Test User1 has done')
  })

  it('New record - Select HIGHER_EDUCATION - navigates to check-answers page', () => {
    const trainingAndQualifications = new TrainingAndQualificationsPage(
      'Does Test User1 have any qualifications or training?',
    )

    trainingAndQualifications.checkboxFieldValue('HIGHER_EDUCATION').click()
    trainingAndQualifications.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select HIGHER_EDUCATION - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/training-and-qualifications/edit')

    const trainingAndQualifications = new TrainingAndQualificationsPage(
      'Does Test User1 have any qualifications or training?',
    )

    trainingAndQualifications.checkboxFieldValue('HIGHER_EDUCATION').click()
    trainingAndQualifications.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
