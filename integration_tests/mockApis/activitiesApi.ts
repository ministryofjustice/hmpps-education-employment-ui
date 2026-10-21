import { stubFor } from './wiremock'

const getUnacceptableAbsenceCount = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/attendances/prisoner/${id}/attendance-summary`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        acceptableAbsence: 0,
        unacceptableAbsence: 2,
        total: 4,
      },
    },
  })

export default {
  getUnacceptableAbsenceCount,
}
