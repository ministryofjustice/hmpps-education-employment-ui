import Page from '../pages/page'
import RightToWorkPage from '../pages/rightToWork'
import SupportOptIn from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import IdentificationPage from '../pages/identification'

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
    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const identification = Page.verifyOnPage(IdentificationPage)

    identification.submitButton().click()

    identification.pageErrorMessage().contains('Select what type of ID Daniel Craig has')
    identification.fieldErrorMessage().contains('Select what type of ID Daniel Craig has')
  })

  it('New record - Select PASSPORT - navigates to ability-to-work page', () => {
    const identification = Page.verifyOnPage(IdentificationPage)

    identification.checkboxFieldValue('PASSPORT').click()
    identification.submitButton().click()

    cy.url().should('include', 'ability-to-work/new')
  })

  it('Existing record - Select PASSPORT - navigates to check-answers page', () => {
    cy.visit('/work-profile/create/G6115VJ/identification/edit')

    const identification = Page.verifyOnPage(IdentificationPage)

    identification.checkboxFieldValue('PASSPORT').click()
    identification.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
