import RightToWorkPage from '../../pages/workReadiness/rightToWork'
import SupportOptInPage from '../../pages/workReadiness/supportOptIn'
import AlreadyInPlacePage from '../../pages/workReadiness/alreadyInPlace'
import AbilityToWorkPage from '../../pages/workReadiness/abilityToWork'
import ManageDrugsAndAlcoholPage from '../../pages/workReadiness/manageDrugsAndAlcohol'

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
    abilityToWork.checkboxFieldValue('DEPENDENCY_ISSUES').click()
    abilityToWork.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const manageDrugsAndAlcoholPage = new ManageDrugsAndAlcoholPage(
      'Is Test User1 currently able to manage their drug or alcohol dependency?',
    )

    manageDrugsAndAlcoholPage.submitButton().click()

    manageDrugsAndAlcoholPage
      .pageErrorMessage()
      .contains('Select whether Test User1 is able to manage their drug or alcohol dependency or not')
    manageDrugsAndAlcoholPage
      .fieldErrorMessage()
      .contains('Select whether Test User1 is able to manage their drug or alcohol dependency or not')
  })

  it('New record - Select ABLE_TO_MANAGE - navigates to type-of-work page', () => {
    const manageDrugsAndAlcoholPage = new ManageDrugsAndAlcoholPage(
      'Is Test User1 currently able to manage their drug or alcohol dependency?',
    )

    manageDrugsAndAlcoholPage.radioFieldValue('ABLE_TO_MANAGE').click()
    manageDrugsAndAlcoholPage.submitButton().click()

    cy.url().should('include', 'type-of-work/new')
  })

  it('Existing record - Select ABLE_TO_MANAGE - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/manage-drugs-and-alcohol/edit')

    const manageDrugsAndAlcoholPage = new ManageDrugsAndAlcoholPage(
      'Is Test User1 currently able to manage their drug or alcohol dependency?',
    )

    manageDrugsAndAlcoholPage.radioFieldValue('ABLE_TO_MANAGE').click()
    manageDrugsAndAlcoholPage.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
