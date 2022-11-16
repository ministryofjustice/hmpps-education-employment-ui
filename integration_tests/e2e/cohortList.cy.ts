import Page from '../pages/page'
import CohortListPage from '../pages/cohortList'

const cohortListUrl = `/work-profile/cohort-list`

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubUserCaseLoads')
    cy.task('stubVerifyToken', true)
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')

    cy.signIn()
    cy.visit(cohortListUrl)
  })

  it('Should display correct number of records in page', () => {
    cy.visit(cohortListUrl)
    const cohortListPage = Page.verifyOnPage(CohortListPage)
    cohortListPage.tableData().then(offenders => {
      expect(offenders.length).equal(10)
    })
  })

  it('Should display the correct pagination', () => {
    cy.visit(cohortListUrl)
    const cohortListPage = Page.verifyOnPage(CohortListPage)
    cohortListPage.paginationResult().should('contain', 'Showing')
    cohortListPage.paginationResult().then(page => {
      expect(page[0].innerText).to.deep.equal('Showing 1 to 0 of 14 results')
    })
  })

  it('Should have correct number of columns to display', () => {
    cy.visit(cohortListUrl)
    const cohortListPage = Page.verifyOnPage(CohortListPage)
    cohortListPage.columnLabels().then(labels => {
      expect(labels[0]).to.deep.equal({
        viewLink: undefined,
        displayName: '',
        releaseDate: '',
        status: '',
        workSummary: '',
        updatedOn: '',
      })
    })
  })

  it('Should show all offenders due to be released within 12 weeks', () => {
    cy.visit(cohortListUrl)
    const cohortListPage = Page.verifyOnPage(CohortListPage)
    cohortListPage.tableData().then(offenders => {
      expect(offenders[0].viewLink).to.contain('/work-profile/G5336UH/view/overview')
      expect(offenders[0].displayName).to.contain('Prough, Conroy')
      expect(offenders[0].releaseDate).to.contain('19 Nov 2022')
      expect(offenders[0].status).to.contain('SUPPORT DECLINED')
      expect(offenders[0].workSummary).to.contain('Returning_to_job')
      expect(offenders[0].updatedOn).to.contain('20 Oct 2022')

      expect(offenders[5].status).to.contain('NOT STARTED')
    })
  })

  it('Should filter result set by status [NEEDS SUPPORT] - no records returned', () => {
    cy.task('stubCohortListSupportNeeded')
    const cohortListPage = Page.verifyOnPage(CohortListPage)
    cohortListPage.radioFieldNeedsSupport().click()
    cohortListPage.searchButton().click()
    cy.visit(`${cohortListUrl}?status=SUPPORT_NEEDED`)

    cy.url().should('include', '?status=SUPPORT_NEEDED')
    cohortListPage.spanMessage().should('contain', '0 results for')
  })

  it('Should filter result to return 1 row corresponding to the name typed', () => {
    cy.task('stubCohortListNameFilter')
    const cohortListPage = Page.verifyOnPage(CohortListPage)
    cohortListPage.searchText().clear().type('ventour')
    cohortListPage.searchButton().click()
    cy.visit(`${cohortListUrl}?lastName=ventour`)

    cy.url().should('include', '?lastName=ventour')
    cohortListPage.tableData().then(offenders => {
      expect(offenders.length).equal(1)
    })
  })

  it('Should return empty table when offender name does not exist', () => {
    cy.task('stubCohortListNameNotExistFilter')
    const cohortListPage = Page.verifyOnPage(CohortListPage)
    cohortListPage.searchText().clear().type('unknown')
    cohortListPage.searchButton().click()
    cy.visit(`${cohortListUrl}?lastName=unknown`)

    cy.url().should('include', '?lastName=unknown')
    cohortListPage.spanMessage().should('contain', '0 results for')
  })
})
