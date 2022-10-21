import type { ReleaseDateSearch } from '../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import { UserDetails } from './userService'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'

function searchPrisonersByReleaseDate(searchTerm: string, prisonIds: string[]): ReleaseDateSearch {
  const [earliestReleaseDate, latestReleaseDate] = searchTerm.split(',')
  return { earliestReleaseDate, latestReleaseDate, prisonIds }
}

const GLOBAL_SEARCH = 'GLOBAL_SEARCH'

export interface UserActiveCaseLoad {
  caseLoadId: string
  description: string
}

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async searchByReleaseDateRaw(
    username: string,
    searchTerm: string,
    prisonIds?: string[],
    token?: string,
    sort?: any,
    order?: any,
    searchFilter?: string,
    page?: number,
  ) {
    const searchRequest = searchPrisonersByReleaseDate(searchTerm, prisonIds)
    return new PrisonerSearchClient(token).searchByReleaseDateRaw(searchRequest, sort, order, searchFilter, page)
  }

  async getUserPrisonCaseloads(user: UserDetails, token: string) {
    const userCaseloads = await new NomisUserRolesApiClient(token).getUserCaseLoads(user)

    const prisonIds = userCaseloads

    if (!prisonIds.includes(GLOBAL_SEARCH)) {
      prisonIds.push('OUT')
    }
    return prisonIds
  }

  async getUserActiveCaseLoad(user: UserDetails, token: string): Promise<UserActiveCaseLoad> {
    const userActiveCaseLoad = await new NomisUserRolesApiClient(token).getUserActiveCaseLoad(user)
    return {
      caseLoadId: userActiveCaseLoad.activeCaseload.id,
      description: userActiveCaseLoad.activeCaseload.name,
    }
  }
}
