/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import GetPrisonerByIdResult from '../data/prisonerSearch/getPrisonerByIdResult'
import config from '../config'
import PrisonerProfileClient from '../data/prisonerProfile/prisonerProfileClient'
import PrisonerSearchResult from '../data/prisonerSearch/prisonerSearchResult'
import getActionsRequired from '../data/prisonerSearch/utils'
import { convertToTitleCase } from '../utils/utils'
import { WorkReadinessProfileStatus } from '../data/domain/types/profileStatus'

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
  const [status, searchTerm] = filterTerm.split(',')

  let filteredStatus: PrisonerSearchResult[]
  if (status && status !== 'ALL') filteredStatus = profiles.filter((p: any) => p.status === status)
  if (status === 'ALL') filteredStatus = profiles.filter((p: any) => p)

  const filteredSearch: () => PrisonerSearchResult[] = () => {
    if (status && searchTerm) {
      if (filteredStatus.length) {
        const filteredByStatusAndName = (filteredStatus as any).filter(
          (p: any) => p.searchTerms.indexOf(searchTerm.toLowerCase()) > -1,
        )
        return [...filteredByStatusAndName]
      }
      return [...filteredStatus]
    }
    if (searchTerm) {
      const filteredByName: PrisonerSearchResult[] = profiles.filter(
        (p: any) => p.searchTerms.indexOf(searchTerm.toLowerCase()) > -1,
      )
      return [...filteredByName]
    }
    return [...filteredStatus]
  }
  return filteredSearch()
}

export interface UserActiveCaseLoad {
  caseLoadId: string
  description: string
}

export interface SearchPrisonersByReleaseDateArgs {
  userToken: string
  username: string
  dateFilter: { earliestReleaseDate: string; latestReleaseDate: string; prisonIds: string[] }
  searchFilter: { status?: string; searchTerm?: string }
  sort?: any
  order?: any
  page?: number
}

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async searchPrisonersByReleaseDate(args: SearchPrisonersByReleaseDateArgs) {
    const { userToken, username, dateFilter, sort, order, searchFilter, page } = args
    const { status, searchTerm } = searchFilter
    const maxPerPage = config.paginationPageSize

    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    const offenders: any = await new PrisonerSearchClient(userToken, systemToken).getPrisonersByReleaseDate(dateFilter)

    /* Combine offender data with their education profile where necessary */
    const filteredOffenderNumbers = offenders.content?.map((p: any) => p.prisonerNumber)
    const offenderProfiles: any = await new PrisonerProfileClient(userToken).getPrisonerProfilesByIds(
      filteredOffenderNumbers,
    )

    // Find matching profiles
    let matchingProfiles: PrisonerSearchResult[] = offenders.content?.map((p: any) => {
      const offenderWithProfile = offenderProfiles?.find((op: any) => op.offenderId === p.prisonerNumber)
      const actionsRequired = offenderWithProfile && getActionsRequired(offenderWithProfile)
      return {
        ...p,
        ...actionsRequired,
        displayName: convertToTitleCase(`${p.lastName}, ${p.firstName}`),
        updatedOn: offenderWithProfile ? offenderWithProfile.modifiedDateTime : null,
        status: offenderWithProfile ? offenderWithProfile.profileData.status : WorkReadinessProfileStatus.NOT_STARTED,
        searchTerms: [
          p.firstName.toLowerCase(),
          p.lastName.toLowerCase(),
          `${p.firstName.toLowerCase()} ${p.lastName.toLowerCase()}`,
          `${p.lastName.toLowerCase()}, ${p.firstName.toLowerCase()}`,
          `${p.firstName.charAt(0).toLowerCase()} ${p.lastName.toLowerCase()}`,
        ].join('|'),
      }
    })

    /* Sort the combined dataset according to sort parameters */
    if (sort && matchingProfiles.length) {
      matchingProfiles = sortOffenderProfile(matchingProfiles, sort, order)
    }

    // Filter result set if required
    if (status || searchTerm) {
      const filter = status.concat(',', searchTerm)
      matchingProfiles = filterOffenderProfiles(matchingProfiles, filter)
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
      numberOfElements: contents.length ? contents[page].length : 0,
      empty: matchingProfiles.length === 0,
    }

    return {
      ...pageMetaData,
      content: contents[page]?.map((result: any) =>
        plainToClass(PrisonerSearchResult, result, { excludeExtraneousValues: true }),
      ),
    }
  }

  async getUserActiveCaseLoad(token: string): Promise<UserActiveCaseLoad> {
    const userActiveCaseLoad = await new NomisUserRolesApiClient(token).getUserActiveCaseLoad()
    return {
      caseLoadId: userActiveCaseLoad.activeCaseload.id,
      description: userActiveCaseLoad.activeCaseload.name,
    }
  }

  async getPrisonerById(username: string, id: string): Promise<GetPrisonerByIdResult> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new PrisonerSearchClient(systemToken, systemToken).getPrisonerById(id)
  }
}
