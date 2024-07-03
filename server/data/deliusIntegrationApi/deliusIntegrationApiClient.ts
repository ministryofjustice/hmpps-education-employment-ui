import config from '../../config'
import RestClient from '../restClient'
import GetCommunityManagerResult from './getCommunityManagerResult'
import GetPrisonerAddressResult from './getPrisonerAddressResult'

export default class DeliusIntegrationApiClient {
  restClient: RestClient

  constructor(systemToken: string) {
    this.restClient = new RestClient('Delius Integration API', config.apis.deliusIntegrationApi, systemToken)
  }

  async getCommunityManager(offenderId: string) {
    const result = await this.restClient.get<GetCommunityManagerResult>({
      path: `/probation-case/${offenderId}/community-manager`,
    })

    return result
  }

  async getPrisonerAddress(offenderId: string) {
    const result = await this.restClient.get<GetPrisonerAddressResult>({
      path: `/probation-case/${offenderId}/main-address`,
    })

    return result
  }
}
