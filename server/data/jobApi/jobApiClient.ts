import config from '../../config'
import RestClient from '../restClient'
import GetMatchedJobsResponse from './getMatchedJobsResponse'
import GetArchivedJobsResponse from './geArchivedJobsResponse'
import GetOtherJobsOfInterestResponse from './getOtherJobsOfInterestResponse'
import GetJobDetailsResponse from './getJobDetailsResponse'
import GetMatchedJobsClosingSoonResponse from './getMatchedJobsClosingSoonResponse'
import GetJobsOfInterestClosingSoonResponse from './getJobOfInterestClosingSoonResponse'
import GetEmployerResponse from './getEmployerResponse'
import PagedResponseNew from '../domain/types/pagedResponseNew'
import TypeOfWorkValue from '../../enums/typeOfWorkValue'

const BASE_URL = ''

export default class JobApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job  API', config.apis.jobApi, token)
  }

  async getMatchedJobs(params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
    jobSectorFilter?: string
    locationFilter?: string
    distanceFilter?: number
  }) {
    const { offenderNo, page = 1, sort, order, jobSectorFilter, locationFilter, distanceFilter } = params

    const uri = [
      `page=${page - 1}`,
      `size=${config.paginationPageSize}`,
      sort && `sortBy=${sort}`,
      order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
      jobSectorFilter && `sector=${encodeURIComponent(jobSectorFilter)}`,
      offenderNo && `offenderNo=${encodeURIComponent(offenderNo)}`,
      locationFilter && `location=${encodeURIComponent(locationFilter)}`,
      distanceFilter && `distance=${encodeURIComponent(distanceFilter)}`,
    ].filter(val => !!val)

    const results = await this.restClient.get<PagedResponseNew<GetMatchedJobsResponse>>({
      path: `/jobs?${uri.join('&')}`,
    })

    return results
  }

  async getOtherJobsOfInterest(params: { offenderNo: string; page?: number; sort?: string; order?: string }) {
    const { offenderNo, page, sort, order } = params

    const results = await this.restClient.post<PagedResponseNew<GetOtherJobsOfInterestResponse>>({
      path: `${BASE_URL}/jobs/interested`,
      data: {
        offenderNo,
        page,
        sort,
        order,
      },
    })
    return results
  }

  async getArchivedJobs(params: { offenderNo: string; page?: number; sort?: string; order?: string }) {
    const { offenderNo, page, sort, order } = params

    const results = await this.restClient.post<PagedResponseNew<GetArchivedJobsResponse>>({
      path: `${BASE_URL}/jobs/archived`,
      data: {
        offenderNo,
        page,
        sort,
        order,
      },
    })
    return results
  }

  async getEmployer(id: string) {
    const result = await this.restClient.get<GetEmployerResponse>({
      path: `/employers/${id}`,
    })

    return result
  }

  async getJobDetails(jobId: string, postCode?: string) {
    const result = await this.restClient.get<GetJobDetailsResponse>({
      path: postCode ? `${BASE_URL}/jobs/${jobId}?postcode=${postCode}` : `${BASE_URL}/jobs/${jobId}`,
    })

    return result
  }

  async getMatchedJobsClosingSoon(params: { offenderNo: string; jobSectorFilter: TypeOfWorkValue[] }) {
    const { offenderNo, jobSectorFilter = [] } = params

    const uri = [
      `page=0`,
      `size=3`,
      jobSectorFilter.length && `sector=${encodeURIComponent(jobSectorFilter[0].toString())}`,
      `offenderNo=${encodeURIComponent(offenderNo)}`,
    ].filter(val => !!val)

    const results = await this.restClient.get<PagedResponseNew<GetMatchedJobsClosingSoonResponse>>({
      path: `/jobs?${uri.join('&')}`,
    })

    return results
  }

  async getJobsOfInterestClosingSoon(offenderNo: string) {
    const result = await this.restClient.get<PagedResponseNew<GetJobsOfInterestClosingSoonResponse>>({
      path: `${BASE_URL}/jobs-of-interest/${offenderNo}/closing-soon`,
    })

    return result
  }
}
