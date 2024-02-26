import RightToWorkPage from '../pages/rightToWork'
import SupportOptInPage from '../pages/supportOptIn'
import AlreadyInPlacePage from '../pages/alreadyInPlace'
import IdentificationPage from '../pages/identification'

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
    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const identification = new IdentificationPage('What type of ID does Daniel Craig have?')

    identification.submitButton().click()

    identification.pageErrorMessage().contains('Select what type of ID Daniel Craig has')
    identification.fieldErrorMessage().contains('Select what type of ID Daniel Craig has')
  })

  it('New record - Select PASSPORT - navigates to ability-to-work page', () => {
    const identification = new IdentificationPage('What type of ID does Daniel Craig have?')

    identification.checkboxFieldValue('PASSPORT').click()
    identification.submitButton().click()

    cy.url().should('include', 'ability-to-work/new')
  })

  it('Existing record - Select PASSPORT - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/identification/edit')

    const identification = new IdentificationPage('What type of ID does Daniel Craig have?')

    identification.checkboxFieldValue('PASSPORT').click()
    identification.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
