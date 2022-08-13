import { plainToClass } from 'class-transformer'
import config from '../../config'
import RestClient from '../restClient'
import PrisonerSearchResult from './prisonerSearchResult'
import PagedResponse from '../domain/types/pagedResponse'
import SearchByReleaseDateFilters from './SearchByReleaseDateFilters'

export interface PrisonerSearchByPrisonerNumber {
  prisonerIdentifier: string
  nomsNumber: string
  prisonIds?: string[]
  includeAliases?: boolean
}

export interface PrisonerSearchByName {
  firstName: string
  lastName: string
  prisonIds?: string[]
  includeAliases?: boolean
}

export interface ReleaseDateSearch {
  // The lower bound for the release date range of which to search - defaults to today if not provided
  earliestReleaseDate: string
  // The upper bound for the release date range of which to search. A required field.
  latestReleaseDate: string
  // List of Prison Ids (can include OUT and TRN) to restrict the search by. Unrestricted if not supplied or null
  prisonIds: string[]
}

type PrisonerSearchRequest = PrisonerSearchByPrisonerNumber | PrisonerSearchByName
type PrisonerSearchByReleaseDate = ReleaseDateSearch

const PRISONER_GLOBAL_SEARCH_PATH = '/global-search'
const PRISONER_DETAIL_SEARCH_PATH = '/prisoner-detail'
const PRISONER_NUMBERS_SEARCH_PATH = '/prisoner-search/prisoner-numbers'

// Match prisoners who have a release date within a range, and optionally by prison
const PRISONER_SEARCH_BY_RELEASE_DATE = '/prisoner-search/release-date-by-prison'

export default class PrisonerSearchClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Search', config.apis.prisonerSearch, token)
  }

  async search(searchData: PrisonerSearchRequest, pageNumber: number): Promise<PagedResponse<PrisonerSearchResult>> {
    const searchType = searchData.prisonIds?.includes('GLOBAL_SEARCH')
      ? `${PRISONER_GLOBAL_SEARCH_PATH}?page=${pageNumber}&size=${config.paginationPageSize}`
      : PRISONER_DETAIL_SEARCH_PATH

    const payload = searchData.prisonIds?.includes('GLOBAL_SEARCH')
      ? { includeAliases: false, ...searchData }
      : { ...searchData, pagination: { page: pageNumber, size: config.paginationPageSize } }

    const results = await this.restClient.post<PagedResponse<PrisonerSearchResult>>({
      path: `${searchType}`,
      data: {
        ...payload,
      },
    })

    return {
      ...results,
      content: results.content.map(result =>
        plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }),
      ),
    }
  }

  async searchByReleaseDate(
    searchData: PrisonerSearchByReleaseDate,
    filters?: SearchByReleaseDateFilters,
    page?: number,
  ): Promise<PagedResponse<PrisonerSearchResult>> {
    const searchType = PRISONER_SEARCH_BY_RELEASE_DATE

    const payload = { ...searchData, pagination: { page, size: config.paginationPageSize } }

    const results = await this.restClient.post<PagedResponse<PrisonerSearchResult>>({
      path: `${searchType}`,
      data: {
        ...payload,
      },
    })

    return {
      ...results,
      content: results.content.map(result =>
        plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }),
      ),
    }
  }

  async findByPrisonerNumbers(prisonerNumbers: Array<string>): Promise<PrisonerSearchResult[]> {
    return this.restClient.post<PrisonerSearchResult[]>({
      path: `${PRISONER_NUMBERS_SEARCH_PATH}`,
      data: {
        prisonerNumbers,
      },
    })
  }
}
