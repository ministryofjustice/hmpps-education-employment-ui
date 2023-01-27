import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonSearchService'
import PaginationService from './paginationServices'
import PrisonerProfileService from './prisonerProfileService'
import CuriousEsweService from './curiousEsweService'
import KeyworkerService from './keyworkerService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearch = new PrisonerSearchService(hmppsAuthClient)
  const prisonerSearchByReleaseDate = new PrisonerSearchService(hmppsAuthClient)
  const prisonerProfileService = new PrisonerProfileService(hmppsAuthClient)
  const paginationService = new PaginationService()
  const curiousEsweService = new CuriousEsweService(hmppsAuthClient)
  const keyworkerService = new KeyworkerService(hmppsAuthClient)
  return {
    userService,
    prisonerSearch,
    paginationService,
    prisonerSearchByReleaseDate,
    prisonerProfileService,
    curiousEsweService,
    keyworkerService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
