/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'
import config from '../../config'
import RestClient from '../restClient'
import UpdateApplicationProgressData from './updateApplicationData'
import GetOpenApplicationsResponse from './getOpenApplicationsResponse'
import GetClosedApplicationsResponse from './getClosedApplicationsResponse'
import GetApplicationProgressResponse from './getApplicationProgressResponse'
import ApplicationSearchResults from './applicationSearchResults'
import mockApplications from './mockApplications'

// const BASE_URL = '/applications'

const mockApplicationProgress = {}

export default class JobApplicationApiClient {
  restClient: RestClient

  static mockApplicationProgress: any

  constructor(token: string) {
    this.restClient = new RestClient('Job Application API', config.apis.jobApi, token)
  }

  async getOpenApplications(offenderNo: string): Promise<GetOpenApplicationsResponse[]> {
    return mockOpenApplications[offenderNo] ? mockOpenApplications[offenderNo] : mockOpenApplications.default
  }

  async getClosedApplications(offenderNo: string): Promise<GetClosedApplicationsResponse[]> {
    return mockClosedApplications[offenderNo] ? mockClosedApplications[offenderNo] : mockClosedApplications.default
  }

  async getApplicationProgress(offenderNo: string, jobId: string): Promise<GetApplicationProgressResponse[]> {
    return _.get(mockApplicationProgress, `job_${jobId}.offender_${offenderNo}`, [])
  }

  async updateApplicationProgress(
    offenderNo: string,
    jobId: string,
    updateApplicationProgressData: UpdateApplicationProgressData,
  ) {
    const currentValue = _.get(mockApplicationProgress, `job_${jobId}.offender_${offenderNo}`, [])
    _.set(mockApplicationProgress, `job_${jobId}.offender_${offenderNo}`, [
      ...currentValue,
      {
        ...updateApplicationProgressData,
        createdByName: 'TEST_USER',
        createdByDateTime: new Date().toISOString(),
      },
    ])
  }

  async applicationSearch(params: {
    prisonId: string
    page?: number
    sort?: string
    order?: string
    applicationStatusFilter?: string
    prisonerNameFilter?: string
    jobFilter?: string
  }): Promise<ApplicationSearchResults> {
    const { applicationStatusFilter, page, prisonerNameFilter = '', jobFilter = '', sort, order = 'ascending' } = params

    let applications = mockApplications
    if (applicationStatusFilter) {
      applications = applications.filter(p => applicationStatusFilter.split(',').includes(p.applicationStatus))
    }

    if (prisonerNameFilter) {
      applications = applications.filter(
        p => `${p.firstName} ${p.lastName}`.indexOf(prisonerNameFilter.toUpperCase()) > -1,
      )
    }

    if (jobFilter) {
      applications = applications.filter(p => `${p.jobTitle} ${p.employerName}`.indexOf(jobFilter.toUpperCase()) > -1)
    }

    if (sort) {
      applications = _.orderBy(applications, [sort], [order === 'ascending' ? 'asc' : 'desc'])
    }

    const chunkedJobs = _.chunk(applications, 10)
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
      totalElements: applications.length ? applications.length : 0,
      last: currentPage === (contents.length ? contents.length - 1 : 0),
      totalPages: contents ? contents.length : 0,
      size: 10,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: currentPage === 0,
      numberOfElements: contents.length ? contents[currentPage].length : 0,
      empty: applications.length === 0,
    }

    return {
      content: contents[currentPage],
      ...pageMetaData,
    } as any
  }
}

const mockOpenApplications = {
  default: [
    {
      applicationId: 1,
      jobId: 2,
      employerName: 'CBS Labour',
      jobTitle: 'Vegetable packing operative',
      applicationStatus: 'Application submitted',
    },
  ],
}

const mockClosedApplications = {
  default: [
    {
      applicationId: 1,
      jobId: 3,
      employerName: 'Z Labour',
      jobTitle: 'Forklift operator',
      applicationStatus: 'Unsuccessful application',
    },
  ],
}
