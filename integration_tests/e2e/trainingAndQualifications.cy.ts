import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'
import TypeOfWorkPage from '../pages/typeOfWork'
import JobOfParticularInterestPage from '../pages/jobOfParticularInterest'
import WorkExperiencePage from '../pages/workExperience'
import TrainingAndQualificationsPage from '../pages/trainingAndQualifications'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
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
    const jobOfParticularInterest = Page.verifyOnPage(JobOfParticularInterestPage)
    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()
    const workExperience = Page.verifyOnPage(WorkExperiencePage)
    workExperience.radioFieldValue('NO').click()
    workExperience.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const trainingAndQualifications = Page.verifyOnPage(TrainingAndQualificationsPage)

    trainingAndQualifications.submitButton().click()

    trainingAndQualifications
      .checkboxPageErrorMessage()
      .contains('Select any qualifications or training Daniel Craig has')
    trainingAndQualifications
      .checkboxFieldErrorMessage()
      .contains('Select any qualifications or training Daniel Craig has')

    trainingAndQualifications.checkboxFieldValue('OTHER').click()
    trainingAndQualifications.submitButton().click()

    trainingAndQualifications
      .detailsPageErrorMessage()
      .contains('Enter details of the qualifications or training Daniel Craig has done')
    trainingAndQualifications
      .detailsFieldErrorMessage()
      .contains('Enter details of the qualifications or training Daniel Craig has done')
  })

  it('New record - Select HIGHER_EDUCATION - navigates to check-answers page', () => {
    const trainingAndQualifications = Page.verifyOnPage(TrainingAndQualificationsPage)

    trainingAndQualifications.checkboxFieldValue('HIGHER_EDUCATION').click()
    trainingAndQualifications.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select HIGHER_EDUCATION - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/training-and-qualifications/edit')

    const trainingAndQualifications = Page.verifyOnPage(TrainingAndQualificationsPage)

    trainingAndQualifications.checkboxFieldValue('HIGHER_EDUCATION').click()
    trainingAndQualifications.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
