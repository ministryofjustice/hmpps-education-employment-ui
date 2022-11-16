/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import config from '../../config'
import RestClient from '../restClient'
import PrisonerSearchResult from './prisonerSearchResult'
import PrisonerProfileClient from '../prisonerProfile/prisonerProfileClient'
import GetPrisonerByIdResult from './getPrisonerByIdResult'
import { WorkReadinessProfileStatus } from '../domain/types/profileStatus'
import getActionsRequired from './utils'
import { convertToTitleCase } from '../../utils/utils'

export interface ReleaseDateSearch {
  // The lower bound for the release date range of which to search - defaults to today if not provided
  earliestReleaseDate: string
  // The upper bound for the release date range of which to search. A required field.
  latestReleaseDate: string
  // List of Prison Ids (can include OUT and TRN) to restrict the search by. Unrestricted if not supplied or null
  prisonIds: string[]
}

type PrisonerSearchByReleaseDate = ReleaseDateSearch

const GET_PRISONER_BY_ID_PATH = '/prisoner'

// Match prisoners who have a release date within a range, and optionally by prison
const PRISONER_SEARCH_BY_RELEASE_DATE = '/prisoner-search/release-date-by-prison'

// Sort dataset, given criteria
function sortOffenderProfile(profiles: PrisonerSearchResult[], sortBy: string, orderBy: string) {
  // eslint-disable-next-line array-callback-return,consistent-return
  return profiles.sort((a, b) => {
    if (sortBy === 'lastName') {
      if (a.lastName > b.lastName) return orderBy === 'ascending' ? 1 : -1
      if (b.lastName > a.lastName) return orderBy === 'ascending' ? -1 : 1
    }
    if (sortBy === 'releaseDate') {
      if (a.releaseDate > b.releaseDate) return orderBy === 'ascending' ? 1 : -1
      if (b.releaseDate > a.releaseDate) return orderBy === 'ascending' ? -1 : 1
    }
    if (sortBy === 'updatedOn') {
      if (new Date(a.updatedOn) > new Date(b.updatedOn)) return orderBy === 'ascending' ? 1 : -1
      if (new Date(b.updatedOn) > new Date(a.updatedOn)) return orderBy === 'ascending' ? -1 : 1
    }
  })
}

// Filter result set based on parameters
function filterOffenderProfiles(profiles: PrisonerSearchResult[], filterTerm: string) {
  const [status, searchBy] = filterTerm.split(',')
  let filteredStatus: PrisonerSearchResult[]
  if (status && status !== 'ALL') filteredStatus = profiles.filter((p: any) => p.status === status)
  if (status === 'ALL') filteredStatus = profiles.filter((p: any) => p)

  const filteredSearch: () => PrisonerSearchResult[] = () => {
    if (status && searchBy) {
      if (filteredStatus.length) {
        const filteredByStatusAndName = (filteredStatus as any).filter(
          (p: any) => p.lastName.toLowerCase() === searchBy.toLowerCase(),
        )
        return [...filteredByStatusAndName]
      }
      return [...filteredStatus]
    }
    if (searchBy) {
      const filteredByName: PrisonerSearchResult[] = profiles.filter((p: any) =>
        p.lastName.toLowerCase().startsWith(searchBy.toLowerCase()),
      )
      return [...filteredByName]
    }
    return [...filteredStatus]
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

  async searchByReleaseDateRaw(
    searchData: PrisonerSearchByReleaseDate,
    sortBy?: string,
    orderBy?: string,
    searchFilter?: string,
    page?: number,
  ) {
    const [status, lastName] = searchFilter.split(',')
    const maxPerPage = config.paginationPageSize
    const maxNumberOfRecordsAllowed = config.maximumNumberOfRecordsToReturn

    const uri = [
      sortBy && `sortBy=${sortBy}`,
      orderBy && `order=${orderBy}`,
      status && status !== 'ALL' && `status=${status}`,
      searchFilter && `searchTerm=${decodeURIComponent(lastName)}`,
      `page=0`,
      `size=${maxNumberOfRecordsAllowed}`,
    ].filter(val => !!val)

    const searchType = uri.length
      ? `${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}`
      : PRISONER_SEARCH_BY_RELEASE_DATE

    const offenders: any = await this.restClient.post<string[]>({
      path: `${searchType}`,
      data: {
        ...searchData,
      },
    })

    /* Combine offender data with their education profile where necessary */
    const filteredOffenderNumbers = offenders.content?.map((p: any) => p.prisonerNumber)
    const offenderProfiles: any = await new PrisonerProfileClient(this.newToken).getPrisonerProfileProfileData(
      filteredOffenderNumbers,
    )

    let matchingProfiles: PrisonerSearchResult[] = offenders.content?.map((p: any) => {
      const offenderWithProfile = offenderProfiles.content?.find((op: any) => op.offenderId === p.prisonerNumber)
      const actionsRequired = offenderWithProfile && getActionsRequired(offenderWithProfile)
      return {
        ...p,
        ...actionsRequired,
        displayName: convertToTitleCase(`${p.lastName}, ${p.firstName}`),
        updatedOn: offenderWithProfile ? offenderWithProfile.modifiedDateTime : null,
        status: offenderWithProfile ? offenderWithProfile.profileData.status : WorkReadinessProfileStatus.NOT_STARTED,
      }
    })

    /* Sort the combined dataset according to sort parameters */
    if (sortBy && matchingProfiles.length) {
      matchingProfiles = sortOffenderProfile(matchingProfiles, sortBy, orderBy)
    }

    // Filter result set if required
    if (searchFilter) {
      matchingProfiles = filterOffenderProfiles(matchingProfiles, searchFilter)
    }

    /* Workout pagination mechanism */
    const contents = matchingProfiles?.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / maxPerPage)
      if (!resultArray[chunkIndex]) {
        // eslint-disable-next-line no-param-reassign
        resultArray[chunkIndex] = []
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])

    const pageMetaData = {
      pageable: {
        sort: { empty: true, sorted: false, unsorted: true },
        offset: maxPerPage * page,
        pageSize: maxPerPage,
        pageNumber: page,
        paged: true,
        unpaged: false,
      },
      totalElements: contents.length ? matchingProfiles.length : 0,
      last: page === (contents.length ? contents.length - 1 : 0),
      totalPages: contents ? contents.length : 0,
      size: maxPerPage,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: page === 0,
      numberOfElements: contents.length < page ? contents[page].length : 0,
      empty: matchingProfiles.length === 0,
    }

    return {
      ...pageMetaData,
      content: contents[page]?.map((result: any) =>
        plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }),
      ),
    }
  }

  async getPrisonerById(id: string): Promise<GetPrisonerByIdResult> {
    return this.restClient.get<GetPrisonerByIdResult>({
      path: `${GET_PRISONER_BY_ID_PATH}/${id}`,
    })
  }
}
