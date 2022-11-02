import { stubFor } from './wiremock'

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
        prisonerNumber: 'G6115VJ',
      },
    },
  })

const getProfileById = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/readiness-profiles/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'G6115VJ',
      },
    },
  })

export default {
  createProfile,
  getProfileById,
}
