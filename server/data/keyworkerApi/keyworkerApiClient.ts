import config from '../../config'
import RestClient from '../restClient'
import GetStaffAllocationsForOffenderResponse from './getStaffAllocationsForOffenderResponse'

export default class KeyworkerApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Keyworker API', config.apis.keyworkerApi, token)
  }

  async getStaffAllocationsForOffender(offenderNo: string) {
    const result = await this.restClient.get<GetStaffAllocationsForOffenderResponse>({
      path: `/prisoners/${offenderNo}/allocations/current?includeContactDetails=true`,
    })

    return result
  }
}
