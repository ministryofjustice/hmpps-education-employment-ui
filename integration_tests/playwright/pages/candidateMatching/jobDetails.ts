import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class JobDetailsPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page, jobTitle: string) {
    super(page, jobTitle)
    this.header = page.locator('h1', { hasText: jobTitle })
  }

  static async verifyOnPage(page: Page, jobTitle: string): Promise<JobDetailsPage> {
    const jobDetailsPage = new JobDetailsPage(page, jobTitle)
    await expect(jobDetailsPage.header).toBeVisible()
    return jobDetailsPage
  }

  backLinkUrl(): Locator {
    return this.page.locator('.govuk-back-link')
  }

  employerName(): Locator {
    return this.page.locator('#employerName')
  }

  jobTitle(): Locator {
    return this.page.locator('#jobTitle')
  }

  sector(): Locator {
    return this.page.locator('#sector')
  }

  postcode(): Locator {
    return this.page.locator('#postcode')
  }

  salaryFrom(): Locator {
    return this.page.locator('#salaryFrom')
  }

  salaryTo(): Locator {
    return this.page.locator('#salaryTo')
  }

  salaryPeriod(): Locator {
    return this.page.locator('#salaryPeriod')
  }

  additionalSalaryInformation(): Locator {
    return this.page.locator('#additionalSalaryInformation')
  }

  workPattern(): Locator {
    return this.page.locator('#workPattern')
  }

  contractType(): Locator {
    return this.page.locator('#contractType')
  }

  hoursPerWeek(): Locator {
    return this.page.locator('#hoursPerWeek')
  }

  essentialCriteria(): Locator {
    return this.page.locator('#essentialCriteria')
  }

  desirableCriteria(): Locator {
    return this.page.locator('#desirableCriteria')
  }

  description(): Locator {
    return this.page.locator('#description')
  }

  offenceExclusions(): Locator {
    return this.page.locator('#offenceExclusions')
  }

  howToApply(): Locator {
    return this.page.locator('#howToApply')
  }

  closingDate(): Locator {
    return this.page.locator('#closingDate')
  }

  startDate(): Locator {
    return this.page.locator('#startDate')
  }

  charityName(): Locator {
    return this.page.locator('#charityName')
  }

  numberOfVacancies(): Locator {
    return this.page.locator('#numberOfVacancies')
  }

  isOnlyForPrisonLeavers(): Locator {
    return this.page.locator('#isOnlyForPrisonLeavers')
  }

  createArchiveRecordButton(): Locator {
    return this.page.locator('[data-qa=create-archive-record-button]')
  }

  manageApplicationsButton(): Locator {
    return this.page.locator('#manage-applications-button')
  }
}
