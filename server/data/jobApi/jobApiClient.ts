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
    isNationalJob?: boolean
    employerId?: string
  }) {
    const {
      offenderNo,
      page = 1,
      sort,
      order,
      jobSectorFilter,
      locationFilter,
      distanceFilter = 9999,
      isNationalJob = false,
      employerId,
    } = params

    const uri = [
      `page=${page - 1}`,
      `size=${config.paginationPageSize}`,
      sort && `sortBy=${sort}`,
      order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
      jobSectorFilter && `sectors=${encodeURIComponent(jobSectorFilter)}`,
      offenderNo && `prisonNumber=${encodeURIComponent(offenderNo)}`,
      locationFilter && `releaseArea=${encodeURIComponent(locationFilter)}`,
      distanceFilter && locationFilter && `searchRadius=${distanceFilter}`,
      config.featureToggles.nationalJobsEnabled && `isNationalJob=${isNationalJob}`,
      config.featureToggles.nationalJobsEnabled &&
        isNationalJob === true &&
        employerId &&
        `employerId=${encodeURIComponent(employerId)}`,
    ].filter(val => !!val)

    const results = await this.restClient.get<PagedResponseNew<GetMatchedJobsResponse>>({
      path: `/jobs/matching-candidate?${uri.join('&')}`,
    })

    return results
  }

  async getOtherJobsOfInterest(params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
    locationFilter?: string
  }) {
    const { offenderNo, page = 1, sort, order, locationFilter } = params

    const uri = [
      `page=${page - 1}`,
      `size=${config.paginationPageSize}`,
      sort && `sortBy=${sort}`,
      order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
      offenderNo && `prisonNumber=${encodeURIComponent(offenderNo)}`,
      locationFilter && `releaseArea=${encodeURIComponent(locationFilter)}`,
    ].filter(val => !!val)

    const results = await this.restClient.get<PagedResponseNew<GetOtherJobsOfInterestResponse>>({
      path: `/jobs/expressed-interest?${uri.join('&')}`,
    })

    return results
  }

  async getArchivedJobs(params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
    locationFilter?: string
  }) {
    const { offenderNo, page = 1, sort, order, locationFilter } = params

    const uri = [
      `page=${page - 1}`,
      `size=${config.paginationPageSize}`,
      sort && `sortBy=${sort}`,
      order && `sortOrder=${order === 'ascending' ? 'asc' : 'desc'}`,
      offenderNo && `prisonNumber=${encodeURIComponent(offenderNo)}`,
      locationFilter && `releaseArea=${encodeURIComponent(locationFilter)}`,
    ].filter(val => !!val)

    const results = await this.restClient.get<PagedResponseNew<GetArchivedJobsResponse>>({
      path: `/jobs/archived?${uri.join('&')}`,
    })

    return results
  }

  async getEmployer(id: string) {
    const result = await this.restClient.get<GetEmployerResponse>({
      path: `/employers/${id}`,
    })

    return result
  }

  async getEmployersWithNationalJobs() {
    const result = await this.restClient.get<GetEmployerResponse>({
      path: `/employers?hasNationalJobs=true`,
    })

    return result
  }

  async getJobDetails(jobId: string, offenderNo: string, postcode?: string) {
    const baseUrl = `/jobs/${jobId}/matching-candidate?prisonNumber=${offenderNo}`
    const result = await this.restClient.get<GetJobDetailsResponse>({
      path: postcode ? `${baseUrl}&releaseArea=${postcode}` : baseUrl,
    })

    return result
  }

  async getMatchedJobsClosingSoon(params: { offenderNo: string; jobSectorFilter: TypeOfWorkValue[] }) {
    const { offenderNo, jobSectorFilter = [] } = params

    const uri = [
      `size=3`,
      jobSectorFilter.length && `sectors=${encodeURIComponent(jobSectorFilter.join(','))}`,
      `prisonNumber=${encodeURIComponent(offenderNo)}`,
    ].filter(val => !!val)

    const results = await this.restClient.get<GetMatchedJobsClosingSoonResponse>({
      path: `/jobs/matching-candidate/closing-soon?${uri.join('&')}`,
    })

    return results
  }

  async getJobsOfInterestClosingSoon(offenderNo: string) {
    const uri = [`size=3`, `prisonNumber=${encodeURIComponent(offenderNo)}`].filter(val => !!val)

    const result = await this.restClient.get<GetJobsOfInterestClosingSoonResponse>({
      path: `/jobs/expressed-interest/closing-soon?${uri.join('&')}`,
    })

    return result
  }

  async createExpressionOfInterest(jobId: string, offenderNo: string) {
    const result = await this.restClient.put({
      path: `/jobs/${jobId}/expressions-of-interest/${offenderNo}`,
    })

    return result
  }

  async deleteExpressionOfInterest(jobId: string, offenderNo: string) {
    const result = await this.restClient.delete({
      path: `/jobs/${jobId}/expressions-of-interest/${offenderNo}`,
    })

    return result
  }

  async createArchiveRecord(jobId: string, offenderNo: string) {
    const result = await this.restClient.put({
      path: `/jobs/${jobId}/archived/${offenderNo}`,
    })

    return result
  }

  async deleteArchiveRecord(jobId: string, offenderNo: string) {
    const result = await this.restClient.delete({
      path: `/jobs/${jobId}/archived/${offenderNo}`,
    })

    return result
  }
}
