import { stubFor } from './wiremock'

const getPomForOffender = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/allocation/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        primary_pom: {
          staff_id: 485588,
          name: 'RENDELL, STEVE',
        },
        secondary_pom: {
          staff_id: 485589,
          name: 'BLOGGS, JOE',
        },
      },
    },
  })

export default {
  getPomForOffender,
}
