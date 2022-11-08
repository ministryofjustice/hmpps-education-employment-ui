/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReleaseDateSearch } from '../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import { UserDetails } from './userService'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import GetPrisonerByIdResult from '../data/prisonerSearch/getPrisonerByIdResult'
import PrisonerSearchResult from '../data/prisonerSearch/prisonerSearchResult'
import PagedResponse from '../data/domain/types/pagedResponse'
import config from '../config'

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

  async getUserActiveCaseLoad(user: UserDetails, token: string): Promise<UserActiveCaseLoad> {
    const userActiveCaseLoad = await new NomisUserRolesApiClient(token).getUserActiveCaseLoad(user)
    return {
      caseLoadId: userActiveCaseLoad.activeCaseload.id,
      description: userActiveCaseLoad.activeCaseload.name,
    }
  }

  async getPrisonerById(userToken: string, id: string): Promise<GetPrisonerByIdResult> {
    return new PrisonerSearchClient(userToken).getPrisonerById(id)
  }

  // Filter result set based on parameters
  async filterOffenderProfiles(
    profiles: PrisonerSearchResult[],
    filterTerm: string,
  ): Promise<PagedResponse<PrisonerSearchResult[]>> {
    const [status, searchBy] = filterTerm.split(',')
    let filteredStatus: PrisonerSearchResult[]
    if (status && status !== 'ALL') filteredStatus = (profiles as any).content.filter((p: any) => p.status === status)
    if (status === 'ALL') filteredStatus = (profiles as any).content.filter((p: any) => p)

    const filteredSearch = () => {
      if (status && searchBy) {
        const filteredByStatusAndName = (filteredStatus as any).filter(
          (p: any) => p.lastName.toLowerCase() === searchBy.toLowerCase(),
        )
        return {
          content: [...filteredByStatusAndName],
          totalElements: filteredByStatusAndName.length,
          totalPages: Math.ceil(filteredByStatusAndName.length / config.paginationPageSize) || 1,
          size: 0,
          pageable: {
            offset: 0,
            sort: {
              empty: true,
              sorted: true,
              unsorted: true,
            },
            pageSize: 0,
            paged: true,
            unpaged: false,
            pageNumber: 0,
          },
          numberOfElements: filteredByStatusAndName.length,
          last: true,
          empty: true,
        }
      }
      if (searchBy) {
        const filteredByName: PrisonerSearchResult[] = (profiles as any).content.filter((p: any) =>
          p.lastName.toLowerCase().startsWith(searchBy.toLowerCase()),
        )
        return {
          content: [...filteredByName],
          totalElements: filteredByName.length,
          totalPages: Math.ceil(filteredByName.length / config.paginationPageSize) || 1,
          size: 0,
          pageable: {
            offset: 0,
            sort: {
              empty: true,
              sorted: true,
              unsorted: true,
            },
            pageSize: 0,
            paged: true,
            unpaged: false,
            pageNumber: 0,
          },
          numberOfElements: filteredByName.length,
          last: true,
          empty: true,
        }
      }
      return {
        content: [...(filteredStatus as any)],
        totalElements: filteredStatus.length,
        totalPages: Math.ceil(filteredStatus.length / config.paginationPageSize) || 1,
        size: 0,
        pageable: {
          offset: 0,
          sort: {
            empty: true,
            sorted: true,
            unsorted: true,
          },
          pageSize: 0,
          paged: true,
          unpaged: false,
          pageNumber: 0,
        },
        numberOfElements: (filteredStatus as any).length,
        last: true,
        empty: true,
      }
    }
    return filteredSearch()
  }
}
