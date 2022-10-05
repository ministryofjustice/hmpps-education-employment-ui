import { stubFor, getMatchingRequests } from './wiremock'

const getPrisonerById = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        firstName: 'Daniel',
        lastName: 'Craig',
      },
    },
  })

export default {
  getPrisonerById,
}
