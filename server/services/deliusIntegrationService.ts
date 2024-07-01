import HmppsAuthClient from '../data/hmppsAuthClient'
import DeliusIntegrationApiClient from '../data/deliusIntegrationApi/deliusIntegrationApiClient'
import GetPrisonerAddressResult from '../data/deliusIntegrationApi/getPrisonerAddressResult'
import GetCommunityManagerResult from '../data/deliusIntegrationApi/getCommunityManagerResult'

export default class DeliusIntegrationService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getComForOffender(username: string, id: string): Promise<GetCommunityManagerResult | undefined> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Get community manager
    const com = await new DeliusIntegrationApiClient(systemToken).getCommunityManager(id)

    return com
  }

  async getAddressForOffender(username: string, id: string): Promise<GetPrisonerAddressResult | undefined> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Get prisoner address
    const address = await new DeliusIntegrationApiClient(systemToken).getPrisonerAddress(id)

    return address
  }
}
