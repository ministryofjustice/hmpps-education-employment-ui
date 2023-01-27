import HmppsAuthClient from '../data/hmppsAuthClient'
import KeyworkerApiClient from '../data/keyworkerApi/keyworkerApiClient'
import GetKeyworkerForOffenderResponse from '../data/keyworkerApi/getKeyworkerForOffenderResponse'

export default class KeyworkerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getKeyworkerForOffender(userToken: string, id: string): Promise<GetKeyworkerForOffenderResponse> {
    return new KeyworkerApiClient(userToken).getKeyworkerForOffender(id)
  }
}
