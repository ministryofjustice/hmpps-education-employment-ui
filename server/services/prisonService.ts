import type { Readable } from 'stream'

import HmppsAuthClient from '../data/hmppsAuthClient'
import GetOffenderActivitiesResponse from '../data/prisonApi/getOffenderActivitiesResponse'
import PrisonApiClient from '../data/prisonApi/prisonApiClient'

export default class PrisonService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getAllOffenderActivities(username: string, id: string): Promise<GetOffenderActivitiesResponse> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new PrisonApiClient(systemToken).getAllOffenderActivities(id)
  }

  async getPrisonerImage(username: string, id: string): Promise<Readable> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new PrisonApiClient(systemToken).getPrisonerImage(id)
  }
}
