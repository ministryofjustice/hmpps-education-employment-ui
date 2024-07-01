import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApiClient from '../data/jobApi/jobApiClient'

export default class JobService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getMatchedJobs(
    username: string,
    params: {
      offenderNo: string
      page?: number
      sort?: string
      order?: string
      typeOfWorkFilter?: string
      locationFilter?: string
      distanceFilter?: number
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getMatchedJobs(params)
  }

  async getJobsOfInterest(
    username: string,
    params: {
      offenderNo: string
      page?: number
      sort?: string
      order?: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getOtherJobsOfInterest(params)
  }

  async getArchivedJobs(
    username: string,
    params: {
      offenderNo: string
      page?: number
      sort?: string
      order?: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getArchivedJobs(params)
  }

  async getJobDetails(username: string, jobId: string, postCode?: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getJobDetails(jobId, postCode)
  }

  async getMatchedJobsClosingSoon(
    username: string,
    params: {
      offenderNo: string
      count?: number
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getMatchedJobsClosingSoon(params)
  }

  async getJobsOfInterestClosingSoon(username: string, offenderNo: string) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getJobsOfInterestClosingSoon(offenderNo)
  }
}
