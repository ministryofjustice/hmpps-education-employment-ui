import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'
import SupportDeclinedReasonPage from '../pages/supportDeclinedReason'
import WhatNeedsToChangePage from '../pages/whatNeedsToChange'

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

    const rightToWorkPage = new RightToWorkPage('Right to work in the UK')
    rightToWorkPage.radioFieldYes().click()
    rightToWorkPage.submitButton().click()

    const supportOptIn = new SupportOptInPage('Does Daniel Craig want support to get work?')
    supportOptIn.radioFieldNo().click()
    supportOptIn.submitButton().click()

    const supportDeclinedReason = new SupportDeclinedReasonPage('Why does Daniel Craig not want support?')
    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const whatNeedsToChange = new WhatNeedsToChangePage(
      'What change in circumstances would make Daniel Craig want to get work?',
    )

    whatNeedsToChange.submitButton().click()

    whatNeedsToChange
      .checkboxPageErrorMessage()
      .contains('Select what change of circumstances would make Daniel Craig want to get work')
    whatNeedsToChange
      .checkboxFieldErrorMessage()
      .contains('Select what change of circumstances would make Daniel Craig want to get work')

    whatNeedsToChange.checkboxFieldValue('OTHER').click()
    whatNeedsToChange.submitButton().click()

    whatNeedsToChange
      .detailsPageErrorMessage()
      .contains('Enter what change of circumstances would make Daniel Craig want to get work')
    whatNeedsToChange
      .detailsFieldErrorMessage()
      .contains('Enter what change of circumstances would make Daniel Craig want to get work')
  })

  it('New record - Select YES - navigates to check-answers page', () => {
    const whatNeedsToChange = new WhatNeedsToChangePage(
      'What change in circumstances would make Daniel Craig want to get work?',
    )

    whatNeedsToChange.checkboxFieldValue('HOUSING_ON_RELEASE').click()
    whatNeedsToChange.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.visit('/profile/create/G6115VJ/what-needs-to-change/edit')

    const whatNeedsToChange = new WhatNeedsToChangePage(
      'What change in circumstances would make Daniel Craig want to get work?',
    )

    whatNeedsToChange.checkboxFieldValue('HOUSING_ON_RELEASE').click()
    whatNeedsToChange.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
