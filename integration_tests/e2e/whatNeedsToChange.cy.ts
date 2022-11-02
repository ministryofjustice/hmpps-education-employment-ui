import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import SupportDeclinedReasonPage from '../pages/supportDeclinedReason'
import WhatNeedsToChangePage from '../pages/whatNeedsToChange'

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
    supportOptIn.radioFieldNo().click()
    supportOptIn.submitButton().click()
    const supportDeclinedReason = Page.verifyOnPage(SupportDeclinedReasonPage)
    supportDeclinedReason.checkboxFieldValue('NO_REASON').click()
    supportDeclinedReason.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const whatNeedsToChange = Page.verifyOnPage(WhatNeedsToChangePage)

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
    const whatNeedsToChange = Page.verifyOnPage(WhatNeedsToChangePage)

    whatNeedsToChange.checkboxFieldValue('HOUSING_ON_RELEASE').click()
    whatNeedsToChange.submitButton().click()

    cy.url().should('include', 'check-answers')
  })

  it('Existing record - Select YES - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/what-needs-to-change/edit')

    const whatNeedsToChange = Page.verifyOnPage(WhatNeedsToChangePage)

    whatNeedsToChange.checkboxFieldValue('HOUSING_ON_RELEASE').click()
    whatNeedsToChange.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
