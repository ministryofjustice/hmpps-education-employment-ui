import HmppsAuthClient from '../data/hmppsAuthClient'
import GetMatchedJobsResponse from '../data/jobApi/getMatchedJobsResponse'
import GetFlaggedJobsResponse from '../data/jobApi/getFlaggedJobsResponse'
import JobApiClient from '../data/jobApi/jobApi'

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
  ): Promise<GetMatchedJobsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getMatchedJobs(params)
  }

  async getFlaggedJobs(
    username: string,
    params: {
      offenderNo: string
      page?: number
      sort?: string
      order?: string
      typeOfWorkFilter?: string
      locationFilter?: string
      distanceFilter?: string
    },
  ): Promise<GetFlaggedJobsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getFlaggedJobs(params)
  }
}
