import HmppsAuthClient from '../data/hmppsAuthClient'

import GetOffenderActivitiesResponse from '../data/prisonApi/getOffenderActivitiesResponse'
import PrisonApiClient from '../data/prisonApi/prisonApiClient'

export default class PrisonService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getAllOffenderActivities(userToken: string, id: string): Promise<GetOffenderActivitiesResponse> {
    return new PrisonApiClient(userToken).getAllOffenderActivities(id)
  }
}
