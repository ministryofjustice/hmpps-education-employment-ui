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
    return {
      content: [
        {
          jobId: 1,
          prisonId: 'HBC1',
          jobTitle: 'Vegetable packing operative',
          prisonerNumber: 'G5823GP',
          employerName: 'CBS packing',
          firstName: 'ADAM',
          lastName: 'ARHMED',
          applicationStatus: 'APPLICATION_MADE',
        },
        {
          jobId: 1,
          prisonId: 'HBC1',
          jobTitle: 'Forklift operator',
          prisonerNumber: 'G3892UH',
          employerName: 'Amazon',
          firstName: 'CHARLES',
          lastName: 'JERMAINE',
          applicationStatus: 'SELECTED_FOR_INTERVIEW',
        },
        {
          jobId: 1,
          prisonId: 'HBC1',
          jobTitle: 'Retail assistant',
          prisonerNumber: 'G3892UH',
          employerName: 'Iceland',
          firstName: 'CHARLES',
          lastName: 'JERMAINE',
          applicationStatus: 'APPLICATION_MADE',
        },
        {
          jobId: 1,
          prisonId: 'HBC1',
          jobTitle: 'Retail assistant',
          prisonerNumber: 'G0143VW',
          employerName: 'Iceland',
          firstName: 'ROSS',
          lastName: 'MCLAUGHLAN',
          applicationStatus: 'APPLICATION_MADE',
        },
      ],
      totalElements: 4,
    }
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
