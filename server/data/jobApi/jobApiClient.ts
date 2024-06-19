/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import RestClient from '../restClient'
import PagedResponse from '../domain/types/pagedResponse'
import GetMatchedJobsResponse from './getMatchedJobsResponse'
import GetArchivedJobsResponse from './geArchivedJobsResponse'
import GetOtherJobsOfInterestResponse from './getOtherJobsOfInterestResponse'
import GetJobDetailsResponse from './getJobDetailsResponse'
import GetMatchedJobsClosingSoonResponse from './getMatchedJobsClosingSoonResponse'
import GetJobsOfInterestClosingSoonResponse from './getJobOfInterestClosingSoonResponse'

const BASE_URL = '/candidate-matching'

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
    typeOfWorkFilter?: string
    locationFilter?: string
    distanceFilter?: number
  }) {
    const { offenderNo, page, sort, order, typeOfWorkFilter, locationFilter, distanceFilter } = params

    const results = await this.restClient.post<PagedResponse<GetMatchedJobsResponse>>({
      path: `${BASE_URL}/jobs/search`,
      data: {
        offenderNo,
        page,
        sort,
        order,
        typeOfWorkFilter,
        locationFilter,
        distanceFilter,
      },
    })
    return results
  }

  async getOtherJobsOfInterest(params: { offenderNo: string; page?: number; sort?: string; order?: string }) {
    const { offenderNo, page, sort, order } = params

    const results = await this.restClient.post<PagedResponse<GetOtherJobsOfInterestResponse>>({
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

    const results = await this.restClient.post<PagedResponse<GetArchivedJobsResponse>>({
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

  async getJobDetails(jobId: string, postCode?: string) {
    const result = await this.restClient.get<GetJobDetailsResponse>({
      path: postCode ? `${BASE_URL}/job/${jobId}?postcode=${postCode}` : `${BASE_URL}/job/${jobId}`,
    })

    return result
  }

  async getMatchedJobsClosingSoon(params: { offenderNo: string; count?: number }) {
    const { offenderNo, count = 3 } = params

    const results = await this.restClient.post<GetMatchedJobsClosingSoonResponse[]>({
      path: `${BASE_URL}/matched-jobs/closing-soon`,
      data: {
        offenderNo,
        count,
      },
    })
    return results
  }

  async getJobsOfInterestClosingSoon(offenderNo: string) {
    const result = await this.restClient.get<GetJobsOfInterestClosingSoonResponse>({
      path: `${BASE_URL}/jobs-of-interest/${offenderNo}/closing-soon`,
    })

    return result
  }
}
