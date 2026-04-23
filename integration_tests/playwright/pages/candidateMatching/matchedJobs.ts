import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class MatchedJobsPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page, prisonerName: string) {
    super(page, `Jobs for ${prisonerName}`)
    this.header = page.locator('h1', { hasText: `Jobs for ${prisonerName}` })
  }

  static async verifyOnPage(page: Page, prisonerName: string): Promise<MatchedJobsPage> {
    const matchedJobsPage = new MatchedJobsPage(page, prisonerName)
    await expect(matchedJobsPage.header).toBeVisible()
    return matchedJobsPage
  }

  backLinkUrl(): Locator {
    return this.page.locator('.govuk-back-link')
  }

  // Sub-navigation elements
  matchedJobsTab(): Locator {
    return this.page.locator('#matched-jobs-tab')
  }

  nationalJobsTab(): Locator {
    return this.page.locator('#national-jobs-tab')
  }

  jobsOfInterestTab(): Locator {
    return this.page.locator('#jobs-of-interest-tab')
  }

  archivedJobsTab(): Locator {
    return this.page.locator('#archived-jobs-tab')
  }

  // Filter panel elements
  locationFilter(): Locator {
    return this.page.locator('#locationFilter')
  }

  distanceFilter(): Locator {
    return this.page.locator('#distanceFilter')
  }

  jobSectorFilter1(): Locator {
    return this.page.locator('#jobSectorFilter-1')
  }

  jobSectorFilter2(): Locator {
    return this.page.locator('#jobSectorFilter-2')
  }

  jobSectorsFilterOtherSection(): Locator {
    return this.page.locator('[data-qa=other-job-sectors-filter-section]')
  }

  jobSectorsFilterOtherSectionToggle(): Locator {
    return this.page.locator('[data-qa=other-job-sectors-filter-section-toggle]')
  }

  jobSectorFilterOther1(): Locator {
    return this.page.locator('#jobSectorFilterOther-1')
  }

  jobSectorFilterOther2(): Locator {
    return this.page.locator('#jobSectorFilterOther-2')
  }

  offenceFilterSection(): Locator {
    return this.page.locator('[data-qa=offence-filter-section]')
  }

  offenceFilterSectionToggle(): Locator {
    return this.page.locator('[data-qa=offence-filter-section-toggle]')
  }

  offenceFilter1(): Locator {
    return this.page.locator('#offenceFilter-1')
  }

  offenceFilter2(): Locator {
    return this.page.locator('#offenceFilter-2')
  }

  applyButton(): Locator {
    return this.page.locator('[data-qa=apply-button]')
  }

  clearFiltersButton(): Locator {
    return this.page.locator('[data-qa=clear-filters-button]')
  }

  // Results table elements
  resultsCounter(): Locator {
    return this.page.locator('[data-qa=results-counter]')
  }

  jobRoleColumnToggle(): Locator {
    return this.page.locator('[data-qa=jobTitle-column-header]')
  }

  jobLocationColumnToggle(): Locator {
    return this.page.locator('[data-qa=distance-column-header]')
  }

  closingDateColumnToggle(): Locator {
    return this.page.locator('[data-qa=closingDate-column-header]')
  }

  async tableData(): Promise<
    Array<{
      jobRole: string
      typeOfWork: string
      location: string
      closingDate: string
    }>
  > {
    const rows = await this.page.locator('#view-offender .govuk-table__row').elementHandles()
    return Promise.all(
      // Skip header row
      rows.slice(1).map(async row => {
        const tds = await row.$$('td.govuk-table__cell')
        return {
          jobRole: tds[0] ? await tds[0].innerText() : '',
          typeOfWork: tds[1] ? await tds[1].innerText() : '',
          location: tds[2] ? await tds[2].innerText() : '',
          closingDate: tds[3] ? await tds[3].innerText() : '',
        }
      }),
    )
  }
}
