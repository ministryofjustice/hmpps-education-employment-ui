import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import AbilityToWorkPage from '../pages/abilityToWork'
import ManageDrugsAndAlcoholPage from '../pages/manageDrugsAndAlcohol'

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
    const supportOptIn = Page.verifyOnPage(SupportOptIn)
    supportOptIn.radioFieldYes().click()
    supportOptIn.submitButton().click()
    const alreadyInPlace = Page.verifyOnPage(AlreadyInPlacePage)
    alreadyInPlace.checkboxFieldValue('BANK_ACCOUNT').click()
    alreadyInPlace.submitButton().click()
    const abilityToWork = Page.verifyOnPage(AbilityToWorkPage)
    abilityToWork.checkboxFieldValue('DEPENDENCY_ISSUES').click()
    abilityToWork.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const manageDrugsAndAlcoholPage = Page.verifyOnPage(ManageDrugsAndAlcoholPage)

    manageDrugsAndAlcoholPage.submitButton().click()

    manageDrugsAndAlcoholPage
      .pageErrorMessage()
      .contains('Select whether Daniel Craig is able to manage their drug or alcohol dependency or not')
    manageDrugsAndAlcoholPage
      .fieldErrorMessage()
      .contains('Select whether Daniel Craig is able to manage their drug or alcohol dependency or not')
  })

  it('New record - Select ABLE_TO_MANAGE - navigates to type-of-work page', () => {
    const manageDrugsAndAlcoholPage = Page.verifyOnPage(ManageDrugsAndAlcoholPage)

    manageDrugsAndAlcoholPage.checkboxFieldValue('ABLE_TO_MANAGE').click()
    manageDrugsAndAlcoholPage.submitButton().click()

    cy.url().should('include', 'type-of-work/new')
  })

  it('Existing record - Select ABLE_TO_MANAGE - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/manage-drugs-and-alcohol/edit')

    const manageDrugsAndAlcoholPage = Page.verifyOnPage(ManageDrugsAndAlcoholPage)

    manageDrugsAndAlcoholPage.checkboxFieldValue('ABLE_TO_MANAGE').click()
    manageDrugsAndAlcoholPage.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
