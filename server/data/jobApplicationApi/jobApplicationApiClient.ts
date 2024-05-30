/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'
import config from '../../config'
import ApplicationStatusValue from '../../enums/applicationStatusValue'
import RestClient from '../restClient'
import UpdateApplicationProgressData from './updateApplicationData'

// const BASE_URL = '/applications'

const mockApplicationProgress = {}

export default class JobApplicationApiClient {
  restClient: RestClient

  static mockApplicationProgress: any

  constructor(token: string) {
    this.restClient = new RestClient('Job Application API', config.apis.jobApi, token)
  }

  async getOpenApplications(offenderNo: string) {
    return mockOpenApplications[offenderNo] ? mockOpenApplications[offenderNo] : mockOpenApplications.default
  }

  async getClosedApplications(offenderNo: string) {
    return mockClosedApplications[offenderNo] ? mockClosedApplications[offenderNo] : mockClosedApplications.default
  }

  async getApplicationProgress(offenderNo: string, jobId: string) {
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
}

const mockOpenApplications = {
  default: {
    content: [
      {
        applicationId: 1,
        employerName: 'CBS Labour',
        jobTitle: 'Vegetable packing operative',
        applicationStatus: 'Application submitted',
      },
    ],
  },
}

const mockClosedApplications = {
  default: {
    content: [
      {
        applicationId: 1,
        employerName: 'Z Labour',
        jobTitle: 'Forklift operator',
        applicationStatus: 'Unsuccessful application',
      },
    ],
  },
}
