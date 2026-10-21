import config from '../../config'
import RestClient from '../restClient'
import GetUnacceptibleAbsenceCountResult from './getUnacceptibleAbsenceCountResult'

const BASE_URL = '/attendances'

export default class ActivitiesApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Activities API', config.apis.activitiesApi, token)
  }

  async getUnacceptibleAbsenceCount(prisonerNumber: string, startDate: Date, endDate: Date) {
    const fromDate = startDate.toISOString().split('T')[0]
    const toDate = endDate.toISOString().split('T')[0]
    const result = await this.restClient.get<GetUnacceptibleAbsenceCountResult>({
      path: `${BASE_URL}/prisoner/${prisonerNumber}/attendance-summary?startDate=${fromDate}&endDate=${toDate}`,
    })

    return result
  }
}
