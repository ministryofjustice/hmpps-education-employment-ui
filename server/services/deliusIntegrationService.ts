import HmppsAuthClient from '../data/hmppsAuthClient'
import DeliusIntegrationApiClient from '../data/deliusIntegrationApi/deliusIntegrationApiClient'

export default class DeliusIntegrationService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getComForOffender(
    username: string,
    id: string,
  ): Promise<{ firstName: string; lastName: string; email: string } | undefined> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    // Get community manager
    const com = await new DeliusIntegrationApiClient(systemToken).getCommunityManager(id)

    return com
  }
}
