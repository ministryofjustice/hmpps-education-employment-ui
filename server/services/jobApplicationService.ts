import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApplicationApiClient from '../data/jobApplicationApi/jobApplicationApiClient'
import GetOpenApplicationsResponse from '../data/jobApplicationApi/getOpenApplicationsResponse'
import GetClosedApplicationsResponse from '../data/jobApplicationApi/getClosedApplicationsResponse'
import GetApplicationProgressResponse from '../data/jobApplicationApi/getApplicationProgressResponse'
import UpdateApplicationProgressData from '../data/jobApplicationApi/updateApplicationData'

export default class JobApplicationService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getOpenApplications(username: string, id: string): Promise<GetOpenApplicationsResponse[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getOpenApplications(id)
  }

  async getClosedApplications(username: string, id: string): Promise<GetClosedApplicationsResponse[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getClosedApplications(id)
  }

  async getApplicationProgress(
    username: string,
    offenderId: string,
    jobId: string,
  ): Promise<GetApplicationProgressResponse[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).getApplicationProgress(offenderId, jobId)
  }

  async updateApplicationProgress(username: string, updateApplicationProgressData: UpdateApplicationProgressData) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApplicationApiClient(systemToken).updateApplicationProgress(updateApplicationProgressData)
  }

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
}
