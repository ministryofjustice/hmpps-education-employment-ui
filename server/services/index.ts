import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonSearchService'
import PaginationService from './paginationServices'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearch = new PrisonerSearchService(hmppsAuthClient)
  const paginationService = new PaginationService()
  return {
    userService,
    prisonerSearch,
    paginationService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
