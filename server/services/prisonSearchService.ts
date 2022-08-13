import { Readable } from 'stream'
import type {
  PrisonerSearchByName,
  PrisonerSearchByPrisonerNumber,
  ReleaseDateSearch,
} from '../data/prisonerSearch/prisonerSearchClient'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import { convertToTitleCase } from '../utils/utils'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonApiClient, { Prison } from '../data/prisonApi/prisonApiClient'
import PrisonerSearchResult from '../data/prisonerSearch/prisonerSearchResult'
import { UserDetails } from './userService'
import PagedResponse from '../data/domain/types/pagedResponse'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import SearchByReleaseDateFilters from '../data/prisonerSearch/SearchByReleaseDateFilters'

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

export interface PrisonerSearchByReleaseDate {
  user: UserDetails
  searchTerm: string
  prisonIds: string[]
  pageNumber?: number
}

const sanitise = (searchTerm: string) => searchTerm.replace(/,/g, ' ').replace(/\s\s+/g, ' ').trim()

const GLOBAL_SEARCH = 'GLOBAL_SEARCH'

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async search({ searchTerm, user, pageNumber = 0 }: PrisonerSearch): Promise<PagedResponse<PrisonerSearchSummary>> {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const sanitisedSearch = sanitise(searchTerm)
    const prisonIds = await this.getUserPrisonCaseload(user)
    const searchRequest = isPrisonerIdentifier(sanitisedSearch)
      ? searchByPrisonerIdentifier(sanitisedSearch, prisonIds)
      : searchByName(sanitisedSearch, prisonIds)

    let results: PagedResponse<PrisonerSearchSummary> = await new PrisonerSearchClient(token).search(
      searchRequest,
      pageNumber,
    )

    // if no results then re-run search which first name and last name swapped
    if (results.content?.length === 0 && 'lastName' in searchRequest) {
      results = await new PrisonerSearchClient(token).search(
        searchByNameReverse(sanitisedSearch, prisonIds),
        pageNumber,
      )
    }

    results.content = await this.decoratePrisonerSearchResults(user.name, results.content)
    return results
  }

  async searchByReleaseDate(
    username: string,
    searchTerm: string,
    prisonIds?: string[],
    token?: string,
    filters?: SearchByReleaseDateFilters,
    pageNumber = 0,
  ): Promise<PagedResponse<PrisonerSearchSummary>> {
    // const token = await this.hmppsAuthClient.getSystemClientToken(username)
    const searchRequest = searchPrisonersByReleaseDate(searchTerm, prisonIds)

    const results: PagedResponse<PrisonerSearchSummary> = await new PrisonerSearchClient(token).searchByReleaseDate(
      searchRequest,
    )

    results.content = await this.decoratePrisonerSearchResults(username, results.content)
    return results
  }

  async getPrisoners(
    username: string,
    prisonerNumbers: Array<string>,
    retrieveLastPrison = true,
  ): Promise<PrisonerSearchSummary[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    const results = await new PrisonerSearchClient(token).findByPrisonerNumbers(prisonerNumbers)
    return this.decoratePrisonerSearchResults(username, results, retrieveLastPrison)
  }

  async getPrisonerImage(username: string, prisonerNumber: string): Promise<Readable> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    return new PrisonApiClient(token).getPrisonerImage(prisonerNumber)
  }

  async getUserPrisonCaseload(user: UserDetails) {
    const token = await this.hmppsAuthClient.getSystemClientToken(user.username)
    const userCaseloads = await new NomisUserRolesApiClient(token).getUserCaseLoads(user)

    const prisonIds = userCaseloads

    if (!prisonIds.includes(GLOBAL_SEARCH)) {
      prisonIds.push('OUT')
    }
    return prisonIds
  }

  async getLastPrison(username: string, prisonerNumber: string): Promise<Prison> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    const lastMovement = await new PrisonApiClient(token).getLastMovement(prisonerNumber)
    return { agencyId: lastMovement[0].fromAgency, description: lastMovement[0].fromAgencyDescription }
  }

  async decoratePrisonerSearchResults(username: string, prisoners: PrisonerSearchResult[], retrieveLastPrison = true) {
    return Promise.all(
      prisoners.map(async prisoner => {
        let lastPrisonId
        let lastPrisonDescription
        if (prisoner.prisonId === 'OUT' && retrieveLastPrison) {
          const lastPrison = await this.getLastPrison(username, prisoner.prisonerNumber)
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
}
