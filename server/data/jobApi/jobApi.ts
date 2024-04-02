import config from '../../config'
import RestClient from '../restClient'

// const BASE_URL = '/jobs'

export default class JobApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job  API', config.apis.jobApi, token)
  }

  async getMatchedJobs(offenderNo: string) {
    return mockMatchedJobs[offenderNo] ? mockMatchedJobs[offenderNo] : mockMatchedJobs.default
  }

  async getFlaggedJobs(offenderNo: string) {
    return mockFlaggedJobs[offenderNo] ? mockFlaggedJobs[offenderNo] : mockFlaggedJobs.default
  }
}

const mockMatchedJobs = {
  default: {
    content: [
      {
        employerName: 'Amazon',
        jobTitle: 'Forklift operator',
        closingDate: new Date().toISOString(),
      },
      {
        employerName: 'Tesco',
        jobTitle: 'Warehouse handler',
        closingDate: new Date().toISOString(),
      },
      {
        employerName: 'Exchange People',
        jobTitle: 'Workshop operative / handler',
        closingDate: new Date().toISOString(),
      },
    ],
  },
}

const mockFlaggedJobs = {
  default: {
    content: [
      {
        employerName: 'ABC Construction',
        jobTitle: 'Bricklayer',
        closingDate: new Date().toISOString(),
      },
    ],
  },
}
