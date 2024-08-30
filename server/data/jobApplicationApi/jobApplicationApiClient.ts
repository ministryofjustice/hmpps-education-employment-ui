import config from '../../config'
import RestClient from '../restClient'
import UpdateApplicationProgressData from './updateApplicationData'
import GetOpenApplicationsResponse from './getOpenApplicationsResponse'
import GetClosedApplicationsResponse from './getClosedApplicationsResponse'
import GetApplicationProgressResponse from './getApplicationProgressResponse'
import ApplicationSearchResults from './applicationSearchResults'
import PagedResponseNew from '../domain/types/pagedResponseNew'

const BASE_URL = '/candidate-matching'

export default class JobApplicationApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job Application API', config.apis.jobApi, token)
  }

  async getOpenApplications(offenderNo: string) {
    const results = await this.restClient.get<PagedResponseNew<GetOpenApplicationsResponse>>({
      path: `${BASE_URL}/applications/${offenderNo}/open`,
    })

    return results
  }

  async getClosedApplications(offenderNo: string) {
    const results = await this.restClient.get<PagedResponseNew<GetClosedApplicationsResponse>>({
      path: `${BASE_URL}/applications/${offenderNo}/closed`,
    })

    return results
  }

  async getApplicationProgress(offenderNo: string, jobId: string) {
    const results = await this.restClient.get<PagedResponseNew<GetApplicationProgressResponse>>({
      path: `${BASE_URL}/applications/${offenderNo}/job/${jobId}`,
    })

    return results
  }

  async updateApplicationProgress(updateApplicationProgressData: UpdateApplicationProgressData) {
    const result = await this.restClient.post({
      path: `${BASE_URL}/application`,
      data: {
        ...updateApplicationProgressData,
      },
    })

    return result
  }

  async applicationSearch(params: {
    prisonId: string
    page?: number
    sort?: string
    order?: string
    applicationStatusFilter?: string
    prisonerNameFilter?: string
    jobFilter?: string
  }) {
    const { prisonId, page = 0, sort, order, applicationStatusFilter, prisonerNameFilter, jobFilter } = params

    const results = await this.restClient.post<PagedResponseNew<ApplicationSearchResults>>({
      path: `${BASE_URL}/applications/search`,
      data: {
        prisonId,
        page,
        sort,
        order,
        applicationStatusFilter,
        prisonerNameFilter,
        jobFilter,
      },
    })
    return results
  }
}
