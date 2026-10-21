import HmppsAuthClient from '../data/hmppsAuthClient'
import ActivitiesApiClient from '../data/activitiesApi/activitiesApiClient'
import GetUnacceptibleAbsenceCountResult from '../data/activitiesApi/getUnacceptibleAbsenceCountResult'

export default class ActivitiesService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getUnacceptibleAbsenceCount(
    username: string,
    id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GetUnacceptibleAbsenceCountResult> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new ActivitiesApiClient(systemToken).getUnacceptibleAbsenceCount(id, startDate, endDate)
  }
}
