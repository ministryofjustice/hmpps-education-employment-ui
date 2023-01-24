import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
    cy.task('getProfileById', 'G6115VJ')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
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
  })

  it('Validation messages display when no value selected', () => {
    const abilityToWork = Page.verifyOnPage(AbilityToWorkPage)

    abilityToWork.submitButton().click()

    abilityToWork.pageErrorMessage().contains("Select what might affect Daniel Craig's ability to work")
    abilityToWork.fieldErrorMessage().contains("Select what might affect Daniel Craig's ability to work")
  })

  it('New record - Select EDUCATION_ENROLLMENT - navigates to type-of-work page', () => {
    const abilityToWork = Page.verifyOnPage(AbilityToWorkPage)

    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'type-of-work/new')
  })

  it('New record - Select DEPENDENCY_ISSUES - navigates to manage-drugs-and-alcohol page', () => {
    const abilityToWork = Page.verifyOnPage(AbilityToWorkPage)

    abilityToWork.checkboxFieldValue('DEPENDENCY_ISSUES').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'manage-drugs-and-alcohol/new')
  })

  it('Existing record - Select EDUCATION_ENROLLMENT - navigates to check-answers page', () => {
    cy.visit('/profile/create/G6115VJ/ability-to-work/edit')

    const abilityToWork = Page.verifyOnPage(AbilityToWorkPage)

    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select DEPENDENCY_ISSUES - navigates to manage-drugs-and-alcohol page', () => {
    cy.visit('/profile/create/G6115VJ/ability-to-work/edit')

    const abilityToWork = Page.verifyOnPage(AbilityToWorkPage)

    abilityToWork.checkboxFieldValue('DEPENDENCY_ISSUES').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'manage-drugs-and-alcohol/edit')
  })
})
