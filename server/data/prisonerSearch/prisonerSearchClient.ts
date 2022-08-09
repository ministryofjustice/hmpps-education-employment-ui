import { plainToClass } from 'class-transformer'
import config from '../../config'
import RestClient from '../restClient'
import PrisonerSearchResult from './prisonerSearchResult'
import PagedResponse from '../domain/types/pagedResponse'

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

type PrisonerSearchRequest = PrisonerSearchByPrisonerNumber | PrisonerSearchByName

const PRISONER_GLOBAL_SEARCH_PATH = '/global-search'
const PRISONER_DETAIL_SEARCH_PATH = '/prisoner-detail'
const PRISONER_NUMBERS_SEARCH_PATH = '/prisoner-search/prisoner-numbers'

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

  async findByPrisonerNumbers(prisonerNumbers: Array<string>): Promise<PrisonerSearchResult[]> {
    return this.restClient.post<PrisonerSearchResult[]>({
      path: `${PRISONER_NUMBERS_SEARCH_PATH}`,
      data: {
        prisonerNumbers,
      },
    })
  }
}
