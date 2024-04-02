import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApplicationApiClient from '../data/jobApplicationApi/jobApplicationApi'
import GetOpenApplicationsResponse from '../data/jobApplicationApi/getOpenApplicationsResponse'
import GetClosedApplicationsResponse from '../data/jobApplicationApi/getClosedApplicationsResponse'

export default class JobApplicationService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getOpenApplications(username: string, id: string): Promise<GetOpenApplicationsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getOpenApplications(id)
  }

  async getClosedApplications(username: string, id: string): Promise<GetClosedApplicationsResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getClosedApplications(id)
  }
}
