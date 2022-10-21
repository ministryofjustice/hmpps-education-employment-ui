import { plainToClass } from 'class-transformer'
import config from '../../config'
import RestClient from '../restClient'
import PrisonerSearchResult from './prisonerSearchResult'
import PrisonerProfileClient from './prisonerProfileClient'
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
      if (a.updatedOn > b.updatedOn) return orderBy === 'ascending' ? 1 : -1
      if (b.updatedOn > a.updatedOn) return orderBy === 'ascending' ? -1 : 1
    }
  })
}

// Filter result set based on parameters
function filterOffenderProfiles(profiles: PrisonerSearchResult[], filterTerm: string): PrisonerSearchResult[] {
  const [status, searchBy] = filterTerm.split(',')
  const filteredStatus = status && profiles.filter(p => p.status === status)
  const filteredSearch = () => {
    if (status && searchBy) {
      return filteredStatus.filter(p => p.lastName.toLowerCase() === searchBy.toLowerCase())
    }
    if (searchBy) {
      return profiles.filter(p => p.lastName.toLowerCase().startsWith(searchBy.toLowerCase()))
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

  async searchByReleaseDateRaw(
    searchData: PrisonerSearchByReleaseDate,
    sortBy?: string,
    orderBy?: string,
    searchFilter?: string,
    page?: number,
  ): Promise<PrisonerSearchResult[]> {
    const [status, lastName] = searchFilter.split(',')
    const uri = [
      sortBy && `sortBy=${sortBy}`,
      orderBy && `order=${orderBy}`,
      status && status !== 'ALL' && `status=${status}`,
      searchFilter && `searchTerm=${decodeURIComponent(lastName)}`,
      page && `page=${page}`,
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

    const filteredOffenderNumbers = offenders.content?.map((p: any) => p.prisonerNumber)

    /* Combine offender data with their education profile where necessary */
    const offenderProfiles: any = await new PrisonerProfileClient(this.newToken).getPrisonerProfileProfileData(
      filteredOffenderNumbers,
    )

    let matchingProfiles: PrisonerSearchResult[] = offenders.content?.map((p: any) => {
      const offenderWithProfile = offenderProfiles?.find((op: any) => op.offenderId === p.prisonerNumber)
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
    if (sortBy) {
      matchingProfiles = sortOffenderProfile(matchingProfiles, sortBy, orderBy)
    }

    const data = {
      prisonerSearchResults: offenders,
      sortBy,
      orderBy,
    }

    return {
      ...offenders,
      data,
      content: matchingProfiles?.map((result: any) =>
        plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }),
      ),
    }
  }
}
