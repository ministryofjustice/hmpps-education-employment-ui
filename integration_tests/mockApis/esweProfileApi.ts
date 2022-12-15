import profiles from '../mockData/profileByIdData'
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

const getProfileById = (id = 'G6115VJ') => stubFor(profiles[id])

export default {
  createProfile,
  getProfileById,
}
