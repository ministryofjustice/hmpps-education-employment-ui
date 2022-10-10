import { stubFor, getMatchingRequests } from './wiremock'

const createProfile = () =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/readiness-profiles/G6115VJ',
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
  createProfile,
}
