import { stubFor } from './wiremock'

const getKeyworker = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/key-worker/offender/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        staffId: 485588,
        firstName: 'STEVE',
        lastName: 'RENDELL',
        status: 'ACTIVE',
      },
    },
  })

export default {
  getKeyworker,
}
