import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'
import TypeOfWorkPage from '../pages/typeOfWork'
import JobOfParticularInterestPage from '../pages/jobOfParticularInterest'
import WorkExperiencePage from '../pages/workExperience'
import SupportDeclinedReasonPage from '../pages/supportDeclinedReason'
import WhatNeedsToChangePage from '../pages/whatNeedsToChange'
import CheckYourAnswersPage from '../pages/checkYourAnswers'
import TrainingAndQualificationsPage from '../pages/trainingAndQualifications'
import IdentificationPage from '../pages/identification'
import ManageDrugsAndAlcoholPage from '../pages/manageDrugsAndAlcohol'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('createProfile', 'G6115VJ')
    cy.task('getProfileById')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit('/wr/profile/create/G6115VJ/right-to-work/new')
  })

  it('Positive flow - Check content and navigation', () => {
    const rightToWork = new RightToWorkPage('Right to work in the UK')
    rightToWork.radioFieldYes().click()
    rightToWork.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Daniel Craig want support to get work?')
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()

    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')
    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()

    const identification = new IdentificationPage('What type of ID does Daniel Craig have?')
    identification.checkboxFieldValue('PASSPORT').click()
    identification.submitButton().click()

    const abilityToWork = new AbilityToWorkPage("What might affect Daniel Craig's ability to work?")
    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.checkboxFieldValue('DEPENDENCY_ISSUES').click()
    abilityToWork.submitButton().click()

    const manageDrugsAndAlcohol = new ManageDrugsAndAlcoholPage(
      'Is Daniel Craig currently able to manage their drug or alcohol dependency?',
    )
    manageDrugsAndAlcohol.radioFieldValue('ABLE_TO_MANAGE').click()
    manageDrugsAndAlcohol.submitButton().click()

    const typeOfWork = new TypeOfWorkPage('What type of work is Daniel Craig interested in?')
    typeOfWork.checkboxFieldValue('CONSTRUCTION').click()
    typeOfWork.checkboxFieldValue('OTHER').click()
    typeOfWork.textareaField().type('Some Industry')
    typeOfWork.submitButton().click()

    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Daniel Craig interested in a particular job?')
    jobOfParticularInterest.radioFieldValue('YES').click()
    jobOfParticularInterest.textareaField().type('Some Job')
    jobOfParticularInterest.submitButton().click()

    const workExperience = new WorkExperiencePage(
      'Does Daniel Craig have any previous work or volunteering experience?',
    )
    workExperience.radioFieldValue('YES').click()
    workExperience.textareaField().type('Some Experience')
    workExperience.submitButton().click()

    const trainingAndQualifications = new TrainingAndQualificationsPage(
      'Does Daniel Craig have any qualifications or training?',
    )
    trainingAndQualifications.checkboxFieldValue('HIGHER_EDUCATION').click()
    trainingAndQualifications.checkboxFieldValue('OTHER').click()
    trainingAndQualifications.textareaField().type('Some Qualification')
    trainingAndQualifications.submitButton().click()

    // Check content
    const checkYourAnswers = new CheckYourAnswersPage("Check your answers before saving them to Daniel Craig's profile")

    checkYourAnswers.rightToWork().contains('Yes')
    checkYourAnswers.rightToWorkLink().click()
    rightToWork.backLink().click()

    checkYourAnswers.supportOptIn().contains('Yes')
    checkYourAnswers.supportOptInLink().click()
    supportOptIn.backLink().click()

    checkYourAnswers.typeOfWork().contains('Construction and trade')
    checkYourAnswers.typeOfWork().contains('Other - Some Industry')
    checkYourAnswers.typeOfWorkLink().click()
    typeOfWork.backLink().click()

    checkYourAnswers.alreadyInPlace().contains('Bank account')
    checkYourAnswers.alreadyInPlaceLink().click()
    alreadyInPlace.backLink().click()

    checkYourAnswers.identification().contains('Passport')
    checkYourAnswers.identificationLink().click()
    identification.backLink().click()

    checkYourAnswers.abilityToWork().contains('Enrolled in education or training')
    checkYourAnswers.abilityToWorkLink().click()
    abilityToWork.backLink().click()

    checkYourAnswers
      .manageDrugsAndAlcohol()
      .contains('Yes, able to manage this with the support they are currently receiving')
    checkYourAnswers.manageDrugsAndAlcoholLink().click()
    manageDrugsAndAlcohol.backLink().click()

    checkYourAnswers.jobOfParticularInterest().contains('Yes - Some Job')
    checkYourAnswers.jobOfParticularInterestLink().click()
    jobOfParticularInterest.backLink().click()

    checkYourAnswers.workExperience().contains('Yes - Some Experience')
    checkYourAnswers.workExperienceLink().click()
    workExperience.backLink().click()

    checkYourAnswers.trainingAndQualifications().contains('Higher education qualification')
    checkYourAnswers.trainingAndQualifications().contains('Other - Some Qualification')
    checkYourAnswers.trainingAndQualificationsLink().click()
    trainingAndQualifications.backLink().click()

    checkYourAnswers.submitButton().click()

    cy.url().should('include', '/profile')
  })

  it('Negative flow - Check content and navigation', () => {
    const rightToWork = new RightToWorkPage('Right to work in the UK')
    rightToWork.radioFieldYes().click()
    rightToWork.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Daniel Craig want support to get work?')
    supportOptIn.radioFieldNo().click()
    supportOptIn.submitButton().click()

    const supportDeclinedReason = new SupportDeclinedReasonPage('Why does Daniel Craig not want support?')
    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()

    const whatNeedsToChange = new WhatNeedsToChangePage(
      'What change in circumstances would make Daniel Craig want to get work?',
    )
    whatNeedsToChange.checkboxFieldValue('HOUSING_ON_RELEASE').click()
    whatNeedsToChange.submitButton().click()

    // Check content
    const checkYourAnswers = new CheckYourAnswersPage("Check your answers before saving them to Daniel Craig's profile")

    checkYourAnswers.rightToWork().contains('Yes')
    checkYourAnswers.rightToWorkLink().click()
    rightToWork.backLink().click()

    checkYourAnswers.supportOptIn().contains('No')
    checkYourAnswers.supportOptInLink().click()
    supportOptIn.backLink().click()

    checkYourAnswers.supportDeclinedReason().contains('Refused support with no reason')
    checkYourAnswers.supportOptInLink().click()
    supportDeclinedReason.backLink().click()

    checkYourAnswers.whatNeedsToChange().contains('Housing in place')
    checkYourAnswers.supportOptInLink().click()
    whatNeedsToChange.backLink().click()

    checkYourAnswers.submitButton().click()

    cy.url().should('include', '/profile')
  })
})
