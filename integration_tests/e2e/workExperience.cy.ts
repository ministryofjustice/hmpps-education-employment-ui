import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'
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
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubVerifyToken', true)
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit('/wr/profile/create/G6115VJ/right-to-work/new')

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

    const jobOfParticularInterest = new JobOfParticularInterestPage('Is Daniel Craig interested in a particular job?')
    jobOfParticularInterest.radioFieldValue('NO').click()
    jobOfParticularInterest.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const workExperience = new WorkExperiencePage(
      'Does Daniel Craig have any previous work or volunteering experience?',
    )

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
    const workExperience = new WorkExperiencePage(
      'Does Daniel Craig have any previous work or volunteering experience?',
    )

    workExperience.radioFieldValue('NO').click()
    workExperience.submitButton().click()

    cy.url().should('include', 'training-and-qualifications/new')
  })

  it('Existing record - Select NO - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/work-experience/edit')

    const workExperience = new WorkExperiencePage(
      'Does Daniel Craig have any previous work or volunteering experience?',
    )

    workExperience.radioFieldValue('NO').click()
    workExperience.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
