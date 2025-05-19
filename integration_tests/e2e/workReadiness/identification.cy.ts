import RightToWorkPage from '../../pages/workReadiness/rightToWork'
import SupportOptInPage from '../../pages/workReadiness/supportOptIn'
import AlreadyInPlacePage from '../../pages/workReadiness/alreadyInPlace'
import IdentificationPage from '../../pages/workReadiness/identification'

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
    alreadyInPlace.checkboxFieldValue('ID').click()
    alreadyInPlace.submitButton().click()
  })

  it('Validation messages display when no value selected', () => {
    const identification = new IdentificationPage('What type of ID does Test User1 have?')

    identification.submitButton().click()

    identification.pageErrorMessage().contains('Select what type of ID Test User1 has')
    identification.fieldErrorMessage().contains('Select what type of ID Test User1 has')
  })

  it('New record - Select PASSPORT - navigates to ability-to-work page', () => {
    const identification = new IdentificationPage('What type of ID does Test User1 have?')

    identification.checkboxFieldValue('PASSPORT').click()
    identification.submitButton().click()

    cy.url().should('include', 'ability-to-work/new')
  })

  it('Existing record - Select PASSPORT - navigates to check-answers page', () => {
    cy.visit('/wr/profile/create/G6115VJ/identification/edit')

    const identification = new IdentificationPage('What type of ID does Test User1 have?')

    identification.checkboxFieldValue('PASSPORT').click()
    identification.submitButton().click()

    cy.url().should('include', 'check-answers')
  })
})
