import { dataAccess } from '../data'
import UserService from './userService'
import PrisonerSearchService from './prisonSearchService'
import PaginationService from './paginationServices'
import PrisonerProfileService from './prisonerProfileService'
import CuriousEsweService from './curiousEsweService'
import KeyworkerService from './keyworkerService'
import PrisonService from './prisonService'
import WhereaboutsService from './whereaboutsService'
import AllocationManagerService from './allocationManagerService'
import CommunityService from './communityService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const prisonerSearchByReleaseDate = new PrisonerSearchService(hmppsAuthClient)
  const prisonerProfileService = new PrisonerProfileService(hmppsAuthClient)
  const paginationService = new PaginationService()
  const curiousEsweService = new CuriousEsweService(hmppsAuthClient)
  const keyworkerService = new KeyworkerService(hmppsAuthClient)
  const prisonService = new PrisonService(hmppsAuthClient)
  const whereaboutsService = new WhereaboutsService(hmppsAuthClient)
  const allocationManagerService = new AllocationManagerService(hmppsAuthClient)
  const communityService = new CommunityService(hmppsAuthClient)

  return {
    userService,
    prisonerSearchService,
    paginationService,
    prisonerSearchByReleaseDate,
    prisonerProfileService,
    curiousEsweService,
    keyworkerService,
    prisonService,
    whereaboutsService,
    allocationManagerService,
    communityService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
