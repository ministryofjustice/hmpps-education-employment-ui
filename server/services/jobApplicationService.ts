import config from '../config'
import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApplicationApiClient from '../data/jobApplicationApi/jobApplicationApiClient'
import UpdateApplicationProgressData from '../data/jobApplicationApi/updateApplicationData'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import { offenderEarliestReleaseDate, formatDateToyyyyMMdd } from '../utils/index'

export default class JobApplicationService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getOpenApplications(username: string, id: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getOpenApplications(id)
  }

  async getClosedApplications(username: string, id: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getClosedApplications(id)
  }

  async getApplicationProgress(username: string, offenderId: string, jobId: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getApplicationProgress(offenderId, jobId)
  }

  async updateApplicationProgress(
    username: string,
    applicationId: string,
    updateApplicationProgressData: UpdateApplicationProgressData,
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).updateApplicationProgress(
      applicationId,
      updateApplicationProgressData,
    )
  }

  // Search all applications
  async applicationSearch(
    username: string,
    params: {
      prisonId: string
      page?: number
      sort?: string
      order?: string
      applicationStatusFilter?: string
      prisonerNameFilter?: string
      jobFilter?: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).applicationSearch(params)
  }

  // Search applications filtered by qualifying current prisoners
  async prisonerApplicationSearch(
    username: string,
    params: {
      prisonId: string
      page?: number
      sort?: string
      order?: string
      applicationStatusFilter?: string
      prisonerNameFilter?: string
      jobFilter?: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Prepare search & date parameters
    const { weeksBeforeRelease } = config

    // ESWE-1370
    const TimeToRelease = {
      TWELVE_WEEKS: 12,
      SIX_MONTHS: 26,
      ALL: 5200,
    } as const

    type TimeToReleaseKey = keyof typeof TimeToRelease
    type TimeToReleaseValue = (typeof TimeToRelease)[TimeToReleaseKey]

    const allFutureReleases: TimeToReleaseValue = TimeToRelease.ALL

    // Build date filter
    const dateFilter = {
      earliestReleaseDate: formatDateToyyyyMMdd(new Date().toString()),
      latestReleaseDate: offenderEarliestReleaseDate(allFutureReleases),
      prisonIds: [params.prisonId],
    }

    // Get list of valid prisoners
    const offenders = await new PrisonerSearchClient(systemToken).getPrisonersByReleaseDate(dateFilter)
    const offenderIds: string[] = offenders.content.map(
      (offender: { prisonerNumber: string }) => offender.prisonerNumber,
    )

    // Get all applications
    const applications = await new JobApplicationApiClient(systemToken).applicationSearch({
      ...params,
      page: 1,
      size: 999999,
    })

    // Filter applications
    const applicationsFiltered = applications.content.filter((app: { prisonNumber: string }) =>
      offenderIds.includes(app.prisonNumber),
    )

    const maxPerPage = config.paginationPageSize

    /* Workout pagination mechanism */
    const contents = applicationsFiltered?.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / maxPerPage)
      if (!resultArray[chunkIndex]) {
        // eslint-disable-next-line no-param-reassign
        resultArray[chunkIndex] = []
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])

    // Paginate results
    const results = {
      content: contents[params.page - 1] || [],
      page: {
        size: maxPerPage,
        number: params.page - 1,
        totalElements: contents.length ? applicationsFiltered.length : 0,
        totalPages: contents.length,
      },
    }

    // Return applications
    return results
  }
}
