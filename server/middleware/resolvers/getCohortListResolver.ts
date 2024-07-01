import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import config from '../../config'
import { formatDateToyyyyMMdd, offenderEarliestReleaseDate } from '../../utils/index'

// Gets prisoner based on id parameter and puts it into request context
const getCohortListResolver =
  (prisonerSearch: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { page, sort, order, status = '', searchTerm = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { username, token } = res.locals.user

    // Prepare search & date parameters
    const { weeksBeforeRelease } = config

    // Build search filter
    const searchFilter = {
      status: status.toString(),
      searchTerm: decodeURIComponent(searchTerm.toString()),
    }

    // Build date filter
    const dateFilter = {
      earliestReleaseDate: formatDateToyyyyMMdd(new Date().toString()),
      latestReleaseDate: offenderEarliestReleaseDate(weeksBeforeRelease),
      prisonIds: [userActiveCaseLoad.caseLoadId],
    }

    try {
      req.context.cohortList = await prisonerSearch.searchPrisonersByReleaseDate({
        userToken: token,
        username,
        dateFilter,
        searchFilter,
        sort,
        order,
        page: page ? +page - 1 : 0,
      })

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCohortListResolver
