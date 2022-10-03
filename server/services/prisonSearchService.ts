import { Readable } from 'stream'
import type {
  PrisonerSearchByName,
  PrisonerSearchByPrisonerNumber,
  ReleaseDateSearch,
} from '../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import { convertToTitleCase, formatDateToyyyyMMdd } from '../utils/utils'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonApiClient, { Prison } from '../data/prisonApi/prisonApiClient'
import PrisonerSearchResult from '../data/prisonerSearch/prisonerSearchResult'
import { UserDetails } from './userService'
import PagedResponse from '../data/domain/types/pagedResponse'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import GetPrisonerByIdResult from '../data/prisonerSearch/getPrisonerByIdResult'

export interface PrisonerSearchSummary extends PrisonerSearchResult {
  displayName?: string
  inUserCaseload?: boolean
  lastPrisonId?: string
  lastPrisonDescription?: string
}

// Anything with a number is considered not to be a name, so therefore an identifier (prison no, PNC no etc.)
const isPrisonerIdentifier = (searchTerm: string) => /\d/.test(searchTerm)

function searchByName(searchTerm: string, prisonIds: string[]): PrisonerSearchByName {
  const [lastName, firstName] = searchTerm.split(' ')
  return { lastName, firstName, prisonIds }
}

function searchByNameReverse(searchTerm: string, prisonIds: string[]): PrisonerSearchByName {
  const [firstName, lastName] = searchTerm.split(' ')
  return { firstName, lastName, prisonIds }
}

function searchByPrisonerIdentifier(searchTerm: string, prisonIds: string[]): PrisonerSearchByPrisonerNumber {
  return {
    prisonerIdentifier: searchTerm.toUpperCase(),
    nomsNumber: searchTerm.toUpperCase(),
    prisonIds,
  }
}

function searchPrisonersByReleaseDate(searchTerm: string, prisonIds: string[]): ReleaseDateSearch {
  const [earliestReleaseDate, latestReleaseDate] = searchTerm.split(',')
  return { earliestReleaseDate, latestReleaseDate, prisonIds }
}

interface PrisonerSearch {
  searchTerm: string
  user: UserDetails
  pageNumber?: number
}

export interface PrisonerSearchByReleaseDate extends PrisonerSearchResult {
  displayName?: string
  searchTerm: string
  prisonIds: string[]
  pageNumber?: number
}

const sanitise = (searchTerm: string) => searchTerm.replace(/,/g, ' ').replace(/\s\s+/g, ' ').trim()

const GLOBAL_SEARCH = 'GLOBAL_SEARCH'

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async searchByReleaseDate(
    username: string,
    searchTerm: string,
    prisonIds?: string[],
    token?: string,
    pageNumber = 0,
  ): Promise<PagedResponse<PrisonerSearchSummary>> {
    const searchRequest = searchPrisonersByReleaseDate(searchTerm, prisonIds)
    const results: PagedResponse<PrisonerSearchSummary> = await new PrisonerSearchClient(token).searchByReleaseDate(
      searchRequest,
    )

    results.content = await this.decoratePrisonerSearchResults(username, results.content, token)
    return results
  }

  async getPrisonerImage(username: string, prisonerNumber: string): Promise<Readable> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    return new PrisonApiClient(token).getPrisonerImage(prisonerNumber)
  }

  async getUserPrisonCaseloads(user: UserDetails, token: string) {
    const userCaseloads = await new NomisUserRolesApiClient(token).getUserCaseLoads(user)

    const prisonIds = userCaseloads

    if (!prisonIds.includes(GLOBAL_SEARCH)) {
      prisonIds.push('OUT')
    }
    return prisonIds
  }

  async getLastPrison(username: string, prisonerNumber: string, token: string): Promise<Prison> {
    const lastMovement = await new PrisonApiClient(token).getLastMovement(prisonerNumber)
    return { agencyId: lastMovement[0].fromAgency, description: lastMovement[0].fromAgencyDescription }
  }

  async decoratePrisonerSearchResults(
    username: string,
    prisoners: PrisonerSearchResult[],
    token: string,
    retrieveLastPrison = true,
  ) {
    return Promise.all(
      prisoners.map(async prisoner => {
        let lastPrisonId
        let lastPrisonDescription
        if (prisoner.prisonId === 'OUT' && retrieveLastPrison) {
          const lastPrison = await this.getLastPrison(username, prisoner.prisonerNumber, token)
          lastPrisonId = lastPrison.agencyId
          lastPrisonDescription = lastPrison.description
        }
        const updatedPrisoner = lastPrisonId ? { ...prisoner, lastPrisonId, lastPrisonDescription } : prisoner
        return {
          ...updatedPrisoner,
          displayName: convertToTitleCase(`${prisoner.lastName}, ${prisoner.firstName}`),
        }
      }),
    )
  }

  async getPrisonerById(userToken: string, id: string): Promise<GetPrisonerByIdResult> {
    return new PrisonerSearchClient(userToken).getPrisonerById(id)
  }
}
