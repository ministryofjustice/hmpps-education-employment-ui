import config from '../../config'
import RestClient from '../restClient'

const BASE_URL = '/api'

export interface GetPomForOffenderResponse {
  id: number
}

export interface ClientContext {
  // eslint-disable-next-line camelcase
  access_token?: string
  // eslint-disable-next-line camelcase
  refresh_token?: string
}

export default class AllocationManagerApiClient {
  restClient: RestClient

  constructor(systemToken: string) {
    this.restClient = new RestClient('Allocation Managers API', config.apis.allocationManagerApi, systemToken)
  }

  async getPomForOffender(offenderNo: string) {
    const result = await this.restClient.get<GetPomForOffenderResponse>({
      path: `${BASE_URL}/allocations/${offenderNo}`,
    })

    return result
  }
}
