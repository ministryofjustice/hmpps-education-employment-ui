import HmppsAuthClient from '../data/hmppsAuthClient'
import GetMatchedJobsResponse from '../data/jobApi/getMatchedJobsResponse'
import GetFlaggedJobsResponse from '../data/jobApi/getFlaggedJobsResponse'
import JobApiClient from '../data/jobApi/jobApi'

export default class JobService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getMatchedJobs(username: string, id: string): Promise<GetMatchedJobsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getMatchedJobs(id)
  }

  async getFlaggedJobs(username: string, id: string): Promise<GetFlaggedJobsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getFlaggedJobs(id)
  }
}
