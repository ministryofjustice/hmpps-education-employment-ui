import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'
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

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Daniel Craig want support to get work?')
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()

    const alreadyInPlace = new AlreadyInPlacePage('What does Daniel Craig have in place already?')
    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const abilityToWork = new AbilityToWorkPage("What might affect Daniel Craig's ability to work?")

    abilityToWork.submitButton().click()

    abilityToWork.pageErrorMessage().contains("Select what might affect Daniel Craig's ability to work")
    abilityToWork.fieldErrorMessage().contains("Select what might affect Daniel Craig's ability to work")
  })

  it('New record - Select EDUCATION_ENROLLMENT - navigates to type-of-work page', () => {
    const abilityToWork = new AbilityToWorkPage("What might affect Daniel Craig's ability to work?")

    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'type-of-work/new')
  })

  it('New record - Select DEPENDENCY_ISSUES - navigates to manage-drugs-and-alcohol page', () => {
    const abilityToWork = new AbilityToWorkPage("What might affect Daniel Craig's ability to work?")

    abilityToWork.checkboxFieldValue('DEPENDENCY_ISSUES').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'manage-drugs-and-alcohol/new')
  })

  it('Existing record - Select EDUCATION_ENROLLMENT - navigates to check-answers page', () => {
    cy.visit('/profile/create/G6115VJ/ability-to-work/edit')

    const abilityToWork = new AbilityToWorkPage("What might affect Daniel Craig's ability to work?")

    abilityToWork.checkboxFieldValue('EDUCATION_ENROLLMENT').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select DEPENDENCY_ISSUES - navigates to manage-drugs-and-alcohol page', () => {
    cy.visit('/profile/create/G6115VJ/ability-to-work/edit')

    const abilityToWork = new AbilityToWorkPage("What might affect Daniel Craig's ability to work?")

    abilityToWork.checkboxFieldValue('DEPENDENCY_ISSUES').click()
    abilityToWork.submitButton().click()

    cy.url().should('include', 'manage-drugs-and-alcohol/edit')
  })
})
