/* eslint-disable @typescript-eslint/no-unused-vars */

import config from '../../config'
import ApplicationStatusValue from '../../enums/applicationStatusValue'
import RestClient from '../restClient'

// const BASE_URL = '/applications'

export default class JobApplicationApiClient {
  restClient: RestClient

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
    return [
      {
        status: ApplicationStatusValue.APPLICATION_MADE,
        createdByName: 'TE£ST_USER',
        createdByDateTime: new Date().toISOString(),
        notes: '',
      },
      {
        status: ApplicationStatusValue.APPLICATION_UNSUCCESSFUL,
        createdByName: 'TE£ST_USER',
        createdByDateTime: new Date().toISOString(),
        notes:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
    ]
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
