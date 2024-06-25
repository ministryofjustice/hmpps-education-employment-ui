import config from '../../config'
import RestClient from '../restClient'
import GetCommunityManagerResult from './getCommunityManagerResult'

export default class DeliusIntegrationApiClient {
  restClient: RestClient

  constructor(systemToken: string) {
    this.restClient = new RestClient('Delius Integration API', config.apis.deliusIntegrationApi, systemToken)
  }

  async getCommunityManager(crn: string) {
    const result = await this.restClient.get<GetCommunityManagerResult>({
      path: `/probation-case/${crn}/community-manager`,
    })

    return result
  }
}
