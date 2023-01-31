import HmppsAuthClient from '../data/hmppsAuthClient'
import WhereaboutsApiClient from '../data/whereaboutsApi/whereaboutsApiClient'
import GetUnacceptibleAbsenceCountResult from '../data/whereaboutsApi/getUnacceptibleAbsenceCountResult'

export default class WhereaboutsService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getUnacceptibleAbsenceCount(
    userToken: string,
    id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GetUnacceptibleAbsenceCountResult> {
    return new WhereaboutsApiClient(userToken).getUnacceptibleAbsenceCount(id, startDate, endDate)
  }
}
