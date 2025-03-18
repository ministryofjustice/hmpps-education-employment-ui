import CohortListPage from '../../pages/workReadiness/cohortList'

const cohortListUrl = `/wr/cohort-list`

context('SignIn', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getUserRoles')
    cy.task('getUserActiveCaseLoad')
    cy.task('stubVerifyToken', true)
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubReadinessProfileSearch')
    cy.task('stubCohortListByReleaseDate')
    cy.task('stubGetUser', { username: 'USER1', name: 'Joe Bloggs' })

    cy.signIn()
    cy.visit(cohortListUrl)
  })

  it('Should display correct number of records in page', () => {
    cy.visit(cohortListUrl)
    const cohortListPage = new CohortListPage()
    cohortListPage.tableData().then(offenders => {
      expect(offenders.length).equal(20)
    })
  })

  it('Should display the correct pagination when result set has more than 20 records ', () => {
    cy.visit(cohortListUrl)
    const cohortListPage = new CohortListPage()
    cohortListPage.paginationResult().should('contain', 'Showing')
    cohortListPage.paginationResult().then(page => {
      expect(page[0].innerText).to.deep.equal('Showing 1 to 20 of 21 results')
    })
  })

  it('Should have correct number of columns to display', () => {
    cy.visit(cohortListUrl)
    const cohortListPage = new CohortListPage()
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
    const cohortListPage = new CohortListPage()
    cohortListPage.tableData().then(offenders => {
      expect(offenders[0].viewLink).to.contain('/wr/profile/G5336UH/view/overview')
      expect(offenders[0].displayName).to.contain('Prough, Conroy')
      expect(offenders[0].releaseDate).to.contain('19 Nov 2022')
      expect(offenders[0].status).to.contain('DOES NOT WANT SUPPORT')
      expect(offenders[0].workSummary).to.contain('Returning to work they had before prison')
      expect(offenders[0].updatedOn).to.contain('20 Oct 2022')

      expect(offenders[5].status).to.contain('NOT STARTED')
    })
  })

  it('Should sort the result table in ascending order by lastname', () => {
    cy.task('stubCohortListSortedByLastName')
    cy.visit(cohortListUrl)
    const cohortListPage = new CohortListPage()
    cohortListPage.tableData().then(offenders => {
      expect(offenders[0].viewLink).to.contain('/wr/profile/G5336UH/view/overview')
      expect(offenders[0].displayName).to.contain('Prough, Conroy')
    })

    cy.get('#lastName-sort-action').click()
    cy.visit(`${cohortListUrl}?sort=lastName&order=ascending`)

    cohortListPage.tableData().then(offenders => {
      expect(offenders[0].viewLink).to.contain('/wr/profile/G6190UD/view/overview')
      expect(offenders[0].displayName).to.contain('Dool, Curt')
      expect(offenders[0].releaseDate).to.contain('14 Mar 2023')
      expect(offenders[0].status).to.contain('NEEDS SUPPORT')
      expect(offenders[0].workSummary).to.contain('Disclosure letter')
      expect(offenders[0].updatedOn).to.contain('20 Oct 2022')
    })
    cy.url().should('include', '?sort=lastName&order=ascending')
  })

  it('Should filter result set by status [READY_TO_WORK] - no records returned', () => {
    cy.task('stubCohortListSupportNeeded')
    const cohortListPage = new CohortListPage()
    cohortListPage.statusSelect().select('SUPPORT_NEEDED')
    cohortListPage.searchButton().click()
    cy.visit(`${cohortListUrl}?status=READY_TO_WORK`)

    cy.url().should('include', '?status=READY_TO_WORK')
    cohortListPage.spanMessage().should('contain', '0 results in')
  })

  it('Should filter result to return 1 row corresponding to the name typed', () => {
    cy.task('stubCohortListNameFilter')
    const cohortListPage = new CohortListPage()
    cohortListPage.searchText().clear().type('ventour')
    cohortListPage.searchButton().click()
    cy.visit(`${cohortListUrl}?searchTerm=ventour`)

    cy.url().should('include', '?searchTerm=ventour')
    cohortListPage.tableData().then(offenders => {
      expect(offenders.length).equal(1)
    })
  })

  it('Should return empty table when offender name does not exist', () => {
    cy.task('stubCohortListNameNotExistFilter')
    const cohortListPage = new CohortListPage()
    cohortListPage.searchText().clear().type('unknown')
    cohortListPage.searchButton().click()
    cy.visit(`${cohortListUrl}?searchTerm=unknown`)

    cy.url().should('include', '?searchTerm=unknown')
    cohortListPage.spanMessage().should('contain', '0 results')
  })
})
