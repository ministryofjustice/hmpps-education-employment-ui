/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'

import config from '../../config'
import RestClient from '../restClient'
import mockJobs from './mockJobs'
import mockJobDetails from './mockJobDetails'

// ToDo: This class is currently using onlt mock data and needs to be changed to call the job API once it is completed

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
    } as any
  }

  async getFlaggedJobs(params: { offenderNo: string; page?: number; sort?: string; order?: string }) {
    const { offenderNo } = params

    return mockFlaggedJobs[offenderNo] ? mockFlaggedJobs[offenderNo] : mockFlaggedJobs.default
  }

  async getArchivedJobs(params: { offenderNo: string; page?: number; sort?: string; order?: string }) {
    const { offenderNo } = params

    return mockArchivedJobs[offenderNo] ? mockArchivedJobs[offenderNo] : mockArchivedJobs.default
  }

  async getJobDetails(jobId: string, postCode?: string) {
    // const testJob = await this.restClient.get({
    //   path: `/prison-leavers-job/2`,
    // })

    const job = mockJobs.find(j => j.id === Number(jobId))
    job.distance = postCode ? 5.4 : 0
    return {
      ...job,
      ...mockJobDetails,
    } as any
  }
}

const mockArchivedJobs = {
  default: {
    content: [
      {
        id: 1,
        employerName: "McDonald's",
        jobTitle: 'Crew Member',
        closingDate: new Date().toISOString(),
        distance: 3.2,
        city: 'Birmingham',
        postcode: 'B4 6UD',
        typeOfWork: 'HOSPITALITY',
      },
      {
        id: 2,
        employerName: 'Starbucks',
        jobTitle: 'Barista',
        closingDate: new Date().toISOString(),
        distance: 1.8,
        city: 'London',
        postcode: 'SW1A 1AA',
        typeOfWork: 'HOSPITALITY',
      },
      {
        id: 3,
        employerName: 'UPS',
        jobTitle: 'Delivery Driver',
        closingDate: new Date().toISOString(),
        distance: 9.4,
        city: 'Liverpool',
        postcode: 'L2 5QQ',
        typeOfWork: 'DRIVING',
      },
    ],
    number: 0,
    size: 10,
    totalElements: 3,
    first: true,
    last: false,
    numberOfElements: 3,
    totalPages: 1,
    hasContent: true,
    pageable: { sort: ['closingDate'], pageNumber: 0, pageSize: 10, offset: 0, paged: false, unpaged: true },
    empty: false,
  },
}

const mockFlaggedJobs = {
  default: {
    content: [
      {
        id: 1,
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
