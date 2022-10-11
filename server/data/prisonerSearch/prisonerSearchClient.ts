import { plainToClass } from 'class-transformer'
import config from '../../config'
import RestClient from '../restClient'
import PrisonerSearchResult from './prisonerSearchResult'
import PagedResponse from '../domain/types/pagedResponse'
import SearchByReleaseDateFilters from './SearchByReleaseDateFilters'
import PrisonerProfileClient from './prisonerProfileClient'
import { WorkReadinessProfileStatus } from '../domain/types/profileStatus'
import getActionsRequired from './utils'
import { convertToTitleCase } from '../../utils/utils'

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

// Match prisoners who have a release date within a range, and optionally by prison
const PRISONER_SEARCH_BY_RELEASE_DATE = '/prisoner-search/release-date-by-prison'

function filterOffenderProfiles(profiles: PrisonerSearchResult[], filterTerm: string): PrisonerSearchResult[] {
  const [status, searchBy] = filterTerm.split(',')
  const filteredStatus = status && profiles.filter(p => p.status === status)
  const filteredSearch = () => {
    if (status && searchBy) {
      return filteredStatus.filter(p => p.lastName.toLowerCase() === searchBy.toLowerCase())
    }
    if (searchBy) {
      return profiles.filter(p => p.lastName.toLowerCase() === searchBy.toLowerCase())
    }
    return filteredStatus
  }
  return filteredSearch()
}

export default class PrisonerSearchClient {
  restClient: RestClient

  newToken: string

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Search', config.apis.prisonerSearch, token)
    this.newToken = token
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
    const { content: offenders = [] } = results

    const listOfOffenderNumbers = offenders.map(p => p.prisonerNumber)

    const offenderProfiles: any = await new PrisonerProfileClient(this.newToken).getPrisonerProfileProfileData(
      listOfOffenderNumbers,
    )
    const matchingProfiles = offenders.map(p => {
      const offenderWithProfile = offenderProfiles.find((op: any) => op.offenderId === p.prisonerNumber)
      const actionsRequired = offenderWithProfile && getActionsRequired(offenderWithProfile)

      return {
        ...p,
        ...actionsRequired,
        updatedOn: offenderWithProfile ? offenderWithProfile.modifiedDateTime : null,
        status: offenderWithProfile ? offenderWithProfile.profileData.status : WorkReadinessProfileStatus.NOT_STARTED,
      }
    })

    return {
      ...results,
      content: matchingProfiles.map(result =>
        plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }),
      ),
    }
  }

  async searchByReleaseDateRaw(
    searchData: PrisonerSearchByReleaseDate,
    sortBy?: string,
    orderBy?: string,
    searchFilter?: string,
  ): Promise<PrisonerSearchResult[]> {
    const searchType = PRISONER_SEARCH_BY_RELEASE_DATE

    const offenders: any = await this.restClient.post<string[]>({
      path: `${searchType}`,
      data: {
        ...searchData,
      },
    })

    const listOfOffenderNumbers = offenders.content?.map((p: any) => p.prisonerNumber)

    const offenderProfiles: any = await new PrisonerProfileClient(this.newToken).getPrisonerProfileProfileData(
      listOfOffenderNumbers,
    )
    let matchingProfiles: PrisonerSearchResult[] = offenders.content?.map((p: any) => {
      const offenderWithProfile = offenderProfiles.find((op: any) => op.offenderId === p.prisonerNumber)
      const actionsRequired = offenderWithProfile && getActionsRequired(offenderWithProfile)

      return {
        ...p,
        ...actionsRequired,
        displayName: convertToTitleCase(`${p.lastName}, ${p.firstName}`),
        updatedOn: offenderWithProfile ? offenderWithProfile.modifiedDateTime : null,
        status: offenderWithProfile ? offenderWithProfile.profileData.status : WorkReadinessProfileStatus.NOT_STARTED,
      }
    })

    /* Filter resultset  */
    if (searchFilter.length > 1) {
      const [status, lastName] = searchFilter.split(',')
      const searchParams = [status && `${status}`, lastName && `${lastName}`]
      matchingProfiles = filterOffenderProfiles(matchingProfiles, searchParams.toString())
    }

    /* Sort the combined dataset according to sort parameters */
    matchingProfiles.sort((a, b) => {
      if (sortBy === 'lastName') {
        if (a.lastName > b.lastName) return orderBy === 'ascending' ? 1 : -1
        if (b.lastName > a.lastName) return orderBy === 'ascending' ? -1 : 1
      }
      if (sortBy === 'releaseDate') {
        if (a.releaseDate > b.releaseDate) return orderBy === 'ascending' ? 1 : -1
        if (b.releaseDate > a.releaseDate) return orderBy === 'ascending' ? -1 : 1
      }
      if (sortBy === 'updatedOn') {
        if (a.updatedOn > b.updatedOn) return orderBy === 'ascending' ? 1 : -1
        if (b.updatedOn > a.updatedOn) return orderBy === 'ascending' ? -1 : 1
      }
      return 0
    })

    return {
      ...offenders,
      content: matchingProfiles.map((result: any) =>
        plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }),
      ),
    }
  }
}
