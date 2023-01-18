import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'
import TypeOfWorkPage from '../pages/typeOfWork'

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
  })

  it('Validation messages display when no value selected', () => {
    const typeOfWork = Page.verifyOnPage(TypeOfWorkPage)

    typeOfWork.submitButton().click()

    typeOfWork.checkboxPageErrorMessage().contains('Select the type of work Daniel Craig is interested in')
    typeOfWork.checkboxFieldErrorMessage().contains('Select the type of work Daniel Craig is interested in')

    typeOfWork.checkboxFieldValue('OTHER').click()
    typeOfWork.submitButton().click()

    typeOfWork.detailsPageErrorMessage().contains('Enter the type of work Daniel Craig is interested in')
    typeOfWork.detailsFieldErrorMessage().contains('Enter the type of work Daniel Craig is interested in')
  })

  it('New record - Select CONSTRUCTION - navigates to job-of-particular-interest page', () => {
    const typeOfWork = Page.verifyOnPage(TypeOfWorkPage)

    typeOfWork.checkboxFieldValue('CONSTRUCTION').click()
    typeOfWork.submitButton().click()

    cy.url().should('include', 'job-of-particular-interest/new')
  })

  it('Existing record - Select CONSTRUCTION - navigates to check-answers page', () => {
    cy.visit('/profile/create/G6115VJ/type-of-work/edit')

    const typeOfWork = Page.verifyOnPage(TypeOfWorkPage)

    typeOfWork.checkboxFieldValue('CONSTRUCTION').click()
    typeOfWork.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
