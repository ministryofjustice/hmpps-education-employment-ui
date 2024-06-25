import { stubFor } from './wiremock'

const getCommunityManager = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/probation-case/${id}/community-manager`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        firstName: 'Bob',
        lastName: 'Kerk',
        email: 'bob.kirk@testemail.com',
      },
    },
  })

export default {
  getCommunityManager,
}
