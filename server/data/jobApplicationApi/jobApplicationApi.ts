import config from '../../config'
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
