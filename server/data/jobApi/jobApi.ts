import _ from 'lodash'
import config from '../../config'
import RestClient from '../restClient'
import mockJobs from './mockJobs'
import mockJobDetails from './mockJobDetails'

// const BASE_URL = '/jobs'

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
    const { typeOfWorkFilter, page, distanceFilter, sort, order = 'ascending' } = params

    let jobs = mockJobs
    if (typeOfWorkFilter) {
      jobs = jobs.filter(p => typeOfWorkFilter.split(',').includes(p.typeOfWork))
    }

    if (distanceFilter > 0) {
      jobs = jobs.filter(p => p.distance <= distanceFilter)
    }

    if (sort) {
      jobs = _.orderBy(jobs, [sort], [order === 'ascending' ? 'asc' : 'desc'])
    }

    const chunkedJobs = _.chunk(jobs, 10)
    const currentPage: number = page ? page - 1 : 0
    const contents = chunkedJobs

    const pageMetaData = {
      pageable: {
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 10 * currentPage,
        pageSize: 10,
        pageNumber: currentPage,
        paged: true,
        unpaged: false,
      },
      totalElements: jobs.length ? jobs.length : 0,
      last: currentPage === (contents.length ? contents.length - 1 : 0),
      totalPages: contents ? contents.length : 0,
      size: 10,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: currentPage === 0,
      numberOfElements: contents.length ? contents[currentPage].length : 0,
      empty: jobs.length === 0,
    }

    return {
      content: contents[currentPage],
      ...pageMetaData,
    }
  }

  async getFlaggedJobs(params: { offenderNo: string; page?: number; sort?: string; order?: string }) {
    const { offenderNo } = params

    return mockFlaggedJobs[offenderNo] ? mockFlaggedJobs[offenderNo] : mockFlaggedJobs.default
  }

  async getCompleteJobDetail(params: { employerName: string; jobTitle?: string; city?: string }) {
    const { employerName, jobTitle, city } = params

    const jobs = mockJobDetails
    if (employerName) {
      if (jobs.employerName !== employerName) return null
    }

    if (jobTitle) {
      if (jobs.jobTitle !== jobTitle) return null
    }

    if (city) {
      if (jobs.city !== city) return null
    }

    return jobs
  }
}

const mockFlaggedJobs = {
  default: {
    content: [
      {
        employerName: 'Amazon',
        jobTitle: 'Forklift operator',
        closingDate: new Date().toISOString(),
        distance: 4.1,
        city: 'Leeds',
        postcode: 'LS23 3JF',
        typeOfWork: 'OUTDOOR',
      },
    ],
    number: 0,
    size: 10,
    totalElements: 1,
    first: true,
    last: false,
    numberOfElements: 1,
    totalPages: 1,
    hasContent: true,
    pageable: { sort: ['closingDate'], pageNumber: 0, pageSize: 10, offset: 0, paged: false, unpaged: true },
    empty: false,
  },
}
