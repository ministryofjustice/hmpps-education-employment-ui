import profiles from '../mockData/profileByIdData'
import { stubFor } from './wiremock'

const createProfile = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/readiness-profiles/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: id,
      },
    },
  })

const updateProfile = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/readiness-profiles/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: id,
      },
    },
  })

const getProfileById = (id = 'G6115VJ') => stubFor(profiles[id])

export default {
  createProfile,
  updateProfile,
  getProfileById,
}
