import HmppsAuthClient from '../data/hmppsAuthClient'
import GetMatchedJobsResponse from '../data/jobApi/getMatchedJobsResponse'
import GetFlaggedJobsResponse from '../data/jobApi/getFlaggedJobsResponse'
import GetArchivedJobsResponse from '../data/jobApi/geArchivedJobsResponse'
import JobApiClient from '../data/jobApi/jobApiClient'
import GetJobDetailsResponse from '../data/jobApi/getJobDetailsResponse'

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
    },
  ): Promise<GetFlaggedJobsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getFlaggedJobs(params)
  }

  async getArchivedJobs(
    username: string,
    params: {
      offenderNo: string
      page?: number
      sort?: string
      order?: string
    },
  ): Promise<GetArchivedJobsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getArchivedJobs(params)
  }

  async getJobDetails(username: string, jobId: string, postCode?: string): Promise<GetJobDetailsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getJobDetails(jobId, postCode)
  }
}
