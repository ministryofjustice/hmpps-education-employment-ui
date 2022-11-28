import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'
import TypeOfWorkPage from '../pages/typeOfWork'
import JobOfParticularInterestPage from '../pages/jobOfParticularInterest'
import WorkExperiencePage from '../pages/workExperience'
import SupportDeclinedReasonPage from '../pages/supportDeclinedReason'
import WhatNeedsToChangePage from '../pages/whatNeedsToChange'
import CheckYourAnswersPage from '../pages/checkYourAnswers'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.signIn()
    cy.visit('/work-profile/create/G6115VJ/right-to-work/new')
    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()
  })

  it('New record - Select NO - navigates to training-and-qualifications page', () => {
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

    // Check content

    const checkYourAnswers = Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswers.submitButton().click()

    cy.url().should('include', 'work-profile')
  })

  it('Existing record - Select NO - navigates to check-answers page', () => {
    const rightToWorkPage = Page.verifyOnPage(RightToWorkPage)
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()
    const supportOptIn = Page.verifyOnPage(SupportOptIn)
    supportOptIn.radioFieldNo().click()
    supportOptIn.submitButton().click()
    const supportDeclinedReason = Page.verifyOnPage(SupportDeclinedReasonPage)
    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()
    const whatNeedsToChange = Page.verifyOnPage(WhatNeedsToChangePage)
    whatNeedsToChange.checkboxFieldValue('HOUSING_ON_RELEASE').click()
    whatNeedsToChange.submitButton().click()

    // Check content

    const checkYourAnswers = Page.verifyOnPage(CheckYourAnswersPage)
    checkYourAnswers.submitButton().click()

    cy.url().should('include', 'work-profile')
  })
})
