import HmppsAuthClient from '../data/hmppsAuthClient'
import AllocationManagerApiClient, {
  GetPomForOffenderResponse,
} from '../data/allocationManagerApi/allocationManagerApiClient'
import config from '../config'

export default class AllocationManagerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getPomForOffender(id: string): Promise<GetPomForOffenderResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(config.apis.hmppsAuth.systemClientId)

    return new AllocationManagerApiClient(systemToken).getPomForOffender(id)
  }
}
