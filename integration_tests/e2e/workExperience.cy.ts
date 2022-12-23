import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'
import TypeOfWorkPage from '../pages/typeOfWork'
import JobOfParticularInterestPage from '../pages/jobOfParticularInterest'
import WorkExperiencePage from '../pages/workExperience'

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
  })

  it('Validation messages display when no value selected', () => {
    const workExperience = Page.verifyOnPage(WorkExperiencePage)

    workExperience.submitButton().click()

    workExperience
      .radioPageErrorMessage()
      .contains('Select if Daniel Craig has any work or volunteering experience or not')
    workExperience
      .radioFieldErrorMessage()
      .contains('Select if Daniel Craig has any work or volunteering experience or not')

    workExperience.radioFieldValue('YES').click()
    workExperience.submitButton().click()

    workExperience.detailsPageErrorMessage().contains("Enter details of Daniel Craig's work or volunteering experience")
    workExperience
      .detailsFieldErrorMessage()
      .contains("Enter details of Daniel Craig's work or volunteering experience")
  })

  it('New record - Select NO - navigates to training-and-qualifications page', () => {
    const workExperience = Page.verifyOnPage(WorkExperiencePage)

    workExperience.radioFieldValue('NO').click()
    workExperience.submitButton().click()

    cy.url().should('include', 'training-and-qualifications/new')
  })

  it('Existing record - Select NO - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/work-experience/edit')

    const workExperience = Page.verifyOnPage(WorkExperiencePage)

    workExperience.radioFieldValue('NO').click()
    workExperience.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
