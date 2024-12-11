import config from '../../config'
import RestClient from '../restClient'
import UpdateApplicationProgressData from './updateApplicationData'
import GetOpenApplicationsResponse from './getOpenApplicationsResponse'
import GetClosedApplicationsResponse from './getClosedApplicationsResponse'
import GetApplicationProgressResponse from './getApplicationProgressResponse'
import ApplicationSearchResults from './applicationSearchResults'
import PagedResponseNew from '../domain/types/pagedResponseNew'

export default class JobApplicationApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job Application API', config.apis.jobApi, token)
  }

  async getOpenApplications(prisonNumber: string) {
    const results = await this.restClient.get<PagedResponseNew<GetOpenApplicationsResponse>>({
      path: `/applications/open?prisonNumber=${prisonNumber}&size=9999`,
    })

    return results
  }

  async getClosedApplications(prisonNumber: string) {
    const results = await this.restClient.get<PagedResponseNew<GetClosedApplicationsResponse>>({
      path: `/applications/closed?prisonNumber=${prisonNumber}&size=9999`,
    })

    return results
  }

  async getApplicationProgress(prisonNumber: string, jobId: string) {
    const results = await this.restClient.get<PagedResponseNew<GetApplicationProgressResponse>>({
      path: `/applications/histories?jobId=${jobId}&prisonNumber=${prisonNumber}`,
    })

    return results
  }

  async updateApplicationProgress(applicationId: string, updateApplicationProgressData: UpdateApplicationProgressData) {
    const result = await this.restClient.put({
      path: `/applications/${applicationId}`,
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
    size?: number
  }) {
    const { prisonId, page = 1, sort, order, applicationStatusFilter, prisonerNameFilter, jobFilter, size } = params

    const uri = [
      `page=${page - 1}`,
      `size=${size || config.paginationPageSize}`,
      sort && `sortBy=${sort}`,
      order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
      prisonId && `prisonId=${encodeURIComponent(prisonId)}`,
      jobFilter && `jobTitleOrEmployerName=${encodeURIComponent(jobFilter)}`,
      applicationStatusFilter && `applicationStatus=${encodeURIComponent(applicationStatusFilter)}`,
      prisonerNameFilter && `prisonerName=${encodeURIComponent(prisonerNameFilter)}`,
    ].filter(val => !!val)

    const results = await this.restClient.get<PagedResponseNew<ApplicationSearchResults>>({
      path: `/applications?${uri.join('&')}`,
    })

    return results
  }
}
