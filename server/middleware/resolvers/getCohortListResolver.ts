import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import {
  formatDateToyyyyMMdd,
  generateHash,
  getSessionData,
  offenderEarliestReleaseDate,
  setSessionData,
} from '../../utils/index'
import GetPrisonerByIdResult from '../../data/prisonerSearch/getPrisonerByIdResult'

const timeToReleaseLookup: Record<string, number> = {
  TWELVE_WEEKS: 12,
  SIX_MONTHS: 26,
  ALL: 5200,
}

// Gets prisoner based on id parameter and puts it into request context
const getCohortListResolver =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { page, sort, order, status = '', searchTerm = '', timeToRelease = 'TWELVE_WEEKS' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { username, token } = res.locals.user

    try {
      // Build search filter
      const searchFilter = {
        status: status.toString(),
        searchTerm: decodeURIComponent(searchTerm.toString()),
      }

      // Get chosen period
      const weeksBeforeRelease = timeToReleaseLookup[timeToRelease.toString()]

      // Build date filter
      const dateFilter = {
        earliestReleaseDate: formatDateToyyyyMMdd(new Date().toString()),
        latestReleaseDate: offenderEarliestReleaseDate(weeksBeforeRelease),
        prisonIds: [userActiveCaseLoad.caseLoadId],
      }

      // Generate a hash for caching
      const lookupHash = generateHash(
        `${dateFilter.earliestReleaseDate}-${dateFilter.latestReleaseDate}-${dateFilter.prisonIds.join(',')}`,
      )

      // Check session for cached offenders list
      let offenders = getSessionData(req, [lookupHash])
      if (!offenders) {
        offenders = await prisonerSearchService.getPrisonersByReleaseDate(username, dateFilter)
        setSessionData(req, [lookupHash], {
          ...offenders,
          content: offenders.content.map((o: GetPrisonerByIdResult) => ({
            prisonerNumber: o.prisonerNumber,
            firstName: o.firstName,
            lastName: o.lastName,
            nonDtoReleaseDateType: o.nonDtoReleaseDateType,
            releaseDate: o.releaseDate,
          })),
        })
      }

      req.context.cohortList = await prisonerSearchService.searchPrisonersByReleaseDate({
        userToken: token,
        username,
        dateFilter,
        searchFilter,
        sort,
        order,
        page: page ? +page - 1 : 0,
        offenders,
      })

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCohortListResolver
