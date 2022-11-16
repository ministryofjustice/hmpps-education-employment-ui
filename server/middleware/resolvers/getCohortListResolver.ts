import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import config from '../../config'
import { formatDateToyyyyMMdd, offenderEarliestReleaseDate } from '../../utils/utils'

// Gets prisoner based on id parameter and puts it into request context
const getCohortListResolver =
  (prisonerSearch: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { page, sort, order, status = '', lastName = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { username, token } = res.locals.user

    // Prepare search & date parameters
    const searchFilter = [status && `${status}`, lastName && `${decodeURIComponent(lastName.toString())}`]
    const filter = searchFilter && searchFilter.join(',')
    const { weeksBeforeRelease } = config
    const dateFilter = `${formatDateToyyyyMMdd(new Date().toString())}, ${offenderEarliestReleaseDate(
      weeksBeforeRelease,
    )}`

    try {
      req.context.cohortList = await prisonerSearch.searchByReleaseDateRaw(
        username,
        dateFilter,
        [userActiveCaseLoad.caseLoadId],
        token,
        sort,
        order,
        filter.length === 1 ? '' : filter,
        page ? +page - 1 : 0,
      )

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCohortListResolver
