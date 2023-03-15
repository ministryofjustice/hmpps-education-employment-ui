import { stubFor } from './wiremock'
import getAllOffenderManagersData from '../mockData/getAllOffenderManagersData'

const getAllOffenderManagers = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/secure/offenders/crn/${id}/allOffenderManagers?includeProbationAreaTeams=true`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: getAllOffenderManagersData,
    },
  })

export default {
  getAllOffenderManagers,
}
