/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReleaseDateSearch } from '../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import { UserDetails } from './userService'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import GetPrisonerByIdResult from '../data/prisonerSearch/getPrisonerByIdResult'

function searchPrisonersByReleaseDate(searchTerm: string, prisonIds: string[]): ReleaseDateSearch {
  const [earliestReleaseDate, latestReleaseDate] = searchTerm.split(',')
  return { earliestReleaseDate, latestReleaseDate, prisonIds }
}

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

  async getUserActiveCaseLoad(token: string): Promise<UserActiveCaseLoad> {
    const userActiveCaseLoad = await new NomisUserRolesApiClient(token).getUserActiveCaseLoad()
    return {
      caseLoadId: userActiveCaseLoad.activeCaseload.id,
      description: userActiveCaseLoad.activeCaseload.name,
    }
  }

  async getPrisonerById(userToken: string, id: string): Promise<GetPrisonerByIdResult> {
    return new PrisonerSearchClient(userToken).getPrisonerById(id)
  }
}
