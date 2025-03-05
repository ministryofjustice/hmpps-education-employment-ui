/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import _, { trim } from 'lodash'

import HmppsAuthClient from '../data/hmppsAuthClient'
import CreateProfileResponse from '../data/prisonerProfile/createProfileResponse'
import GetProfileByIdResult from '../data/prisonerProfile/getProfileByIdResult'
import CreateProfileRequestArgs from '../data/prisonerProfile/interfaces/createProfileRequestArgs'
import Note from '../data/prisonerProfile/interfaces/note'
import UpdatePrisonerProfile from '../data/prisonerProfile/interfaces/updatePrisonerProfile'
import PrisonerProfileClient from '../data/prisonerProfile/prisonerProfileClient'
import PrisonerSearchResult from '../data/prisonerSearch/prisonerSearchResult'
import { convertToTitleCase } from '../utils/index'
import { WorkReadinessProfileStatus } from '../data/domain/types/profileStatus'
import config from '../config'
import PagedResponse from '../data/domain/types/pagedResponse'
import GetPrisonerByIdResult from '../data/prisonerSearch/getPrisonerByIdResult'

// Sort dataset, given criteria
function sortPrisonersToMatchJobs(profiles: PrisonerSearchResult[], sortBy: string, orderBy: string) {
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
function filterPrisonersToMatchJobs(
  profiles: PrisonerSearchResult[],
  status: string[],
  searchTerm: string,
  typeOfWork: string,
) {
  let filteredList: PrisonerSearchResult[]
  filteredList = profiles.filter((p: any) => status.includes(p.status))

  if (typeOfWork) {
    filteredList = filteredList.filter((p: any) => (p.workTypeInterests || []).includes(typeOfWork))
  }

  const filteredSearch: () => PrisonerSearchResult[] = () => {
    if (status && searchTerm) {
      if (filteredList.length) {
        const filteredByStatusAndName = (filteredList as any).filter(
          (p: any) => p.searchTerms.indexOf(trim(searchTerm.toLowerCase())) > -1,
        )
        return [...filteredByStatusAndName]
      }
      return [...filteredList]
    }
    if (searchTerm) {
      const filteredByName: PrisonerSearchResult[] = profiles.filter(
        (p: any) => p.searchTerms.indexOf(trim(searchTerm.toLowerCase())) > -1,
      )
      return [...filteredByName]
    }
    return [...filteredList]
  }
  return filteredSearch()
}

export interface GetPrisonersToMatchJobsArgs {
  userToken: string
  username: string
  dateFilter: { earliestReleaseDate: string; latestReleaseDate: string; prisonIds: string[] }
  searchFilter: { status?: string[]; searchTerm?: string; typeOfWork: string }
  sort?: any
  order?: any
  page?: number
  offenders: PagedResponse<GetPrisonerByIdResult>
}

export default class PrisonerProfileService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getProfileById(userToken: string, id: string): Promise<GetProfileByIdResult> {
    return new PrisonerProfileClient(userToken).getProfileById(id)
  }

  async createProfile(userToken: string, newProfile: CreateProfileRequestArgs): Promise<CreateProfileResponse> {
    return new PrisonerProfileClient(userToken).createProfile(newProfile)
  }

  async updateProfile(
    userToken: string,
    prisonerId: string,
    profile: UpdatePrisonerProfile,
  ): Promise<CreateProfileResponse> {
    return new PrisonerProfileClient(userToken).updateProfile(prisonerId, profile)
  }

  async getNotes(userToken: string, prisonerId: string, attribute: string): Promise<Note[]> {
    return new PrisonerProfileClient(userToken).getNotes(prisonerId, attribute.toUpperCase())
  }

  async createNote(userToken: string, prisonerId: string, attribute: string, text: string): Promise<Note[]> {
    return new PrisonerProfileClient(userToken).createNote(prisonerId, attribute.toUpperCase(), text)
  }

  async getPrisonersToMatchJobs(args: GetPrisonersToMatchJobsArgs) {
    const { userToken, sort, order, searchFilter, page, offenders } = args
    const { status = ['READY_TO_WORK'], searchTerm, typeOfWork } = searchFilter
    const maxPerPage = config.paginationPageSize

    /* Combine offender data with their education profile where necessary */
    const filteredOffenderNumbers = offenders.content?.map((p: any) => p.prisonerNumber)
    const offenderProfiles: any = await new PrisonerProfileClient(userToken).getPrisonerProfilesByIds(
      filteredOffenderNumbers,
    )

    // Find matching profiles
    let matchingProfiles: PrisonerSearchResult[] = offenders.content?.map((p: any) => {
      const offenderWithProfile = offenderProfiles?.find((op: any) => op.offenderId === p.prisonerNumber)
      return {
        ...p,
        workTypeInterests: _.get(offenderWithProfile, 'profileData.supportAccepted.workInterests.workTypesOfInterest'),
        displayName: convertToTitleCase(`${p.lastName}, ${p.firstName}`),
        updatedOn: offenderWithProfile ? offenderWithProfile.modifiedDateTime : null,
        status: offenderWithProfile ? offenderWithProfile.profileData.status : WorkReadinessProfileStatus.NOT_STARTED,
        searchTerms: [
          p.prisonerNumber.toLowerCase(),
          p.firstName.toLowerCase(),
          p.lastName.toLowerCase(),
          `${p.firstName.toLowerCase()}, ${p.lastName.toLowerCase()}`,
          `${p.firstName.toLowerCase()} ${p.lastName.toLowerCase()}`,
          `${p.lastName.toLowerCase()}, ${p.firstName.toLowerCase()}`,
          `${p.lastName.toLowerCase()} ${p.firstName.toLowerCase()}`,
          `${p.firstName.charAt(0).toLowerCase()} ${p.lastName.toLowerCase()}`,
        ].join('|'),
      }
    })

    /* Sort the combined dataset according to sort parameters */
    if (sort && matchingProfiles.length) {
      matchingProfiles = sortPrisonersToMatchJobs(matchingProfiles, sort, order)
    }

    // Filter result set if required
    if (status || searchTerm || typeOfWork) {
      matchingProfiles = filterPrisonersToMatchJobs(matchingProfiles, status, searchTerm, typeOfWork)
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
}
