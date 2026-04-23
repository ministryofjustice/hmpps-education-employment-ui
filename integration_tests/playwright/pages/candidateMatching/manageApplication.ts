import { type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ManageApplicationPage extends AbstractPage {
  readonly page: Page

  constructor(page: Page) {
    super(page)
    this.page = page
  }

  backLinkUrl(): Locator {
    return this.page.locator('.govuk-back-link')
  }

  jobTitle(): Locator {
    return this.page.locator('[data-qa=job-title]')
  }

  employerName(): Locator {
    return this.page.locator('[data-qa=employer-name]')
  }

  jobLocation(): Locator {
    return this.page.locator('[data-qa=job-location]')
  }

  closingDate(): Locator {
    return this.page.locator('[data-qa=closing-date]')
  }

  howToApply(): Locator {
    return this.page.locator('[data-qa=how-to-apply]')
  }

  updateProgressButton(): Locator {
    return this.page.locator('#update-progress-link')
  }

  applicationStatus(): Locator {
    return this.page.locator('#applicationStatus')
  }

  additionalInformation(): Locator {
    return this.page.locator('#additionalInformation')
  }

  applicationStatusPageErrorMessage(): Locator {
    return this.page.locator('[href="#applicationStatus"]')
  }

  applicationStatusFieldErrorMessage(): Locator {
    return this.page.locator('#applicationStatus-error')
  }

  submitButton(): Locator {
    return this.page.locator('[data-qa=submit-button]')
  }

  async tableData(): Promise<Array<{ status: string; moreInformation: string }>> {
    const rows = await this.page.locator('#applicationHistory .govuk-table__body tr').elementHandles()
    return Promise.all(
      rows.map(async row => {
        const tds = await row.$$('td.govuk-table__cell')
        return {
          status: tds[0] ? await tds[0].innerText() : '',
          moreInformation: tds[1] ? await tds[1].innerText() : '',
        }
      }),
    )
  }
}
