import config from '../../config'
import RestClient from '../restClient'
import mockJobs from './mockJobs'

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
    content: mockJobs,
    number: 0,
    size: 10,
    totalElements: 24,
    first: true,
    last: false,
    numberOfElements: 10,
    totalPages: 3,
    hasContent: true,
    pageable: { sort: ['closingDate'], pageNumber: 0, pageSize: 10, offset: 0, paged: true, unpaged: false },
    empty: false,
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
    number: 0,
    size: 10,
    totalElements: 24,
    first: true,
    last: false,
    numberOfElements: 10,
    totalPages: 3,
    hasContent: true,
    pageable: { sort: ['closingDate'], pageNumber: 0, pageSize: 10, offset: 0, paged: true, unpaged: false },
    empty: false,
  },
}
