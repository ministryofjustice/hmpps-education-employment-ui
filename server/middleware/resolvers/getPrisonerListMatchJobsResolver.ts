import type { RequestHandler } from 'express'

import config from '../../config'
import { formatDateToyyyyMMdd, offenderEarliestReleaseDate } from '../../utils/index'
import PrisonerProfileService from '../../services/prisonerProfileService'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerListMatchJobsResolver =
  (prisonerProfileService: PrisonerProfileService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { page, sort, order, showNeedsSupportFilter, prisonerNameFilter = '', typeOfWorkFilter = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { username, token } = res.locals.user

    try {
      // Prepare search & date parameters
      const { weeksBeforeRelease } = config

      // Build search filter
      const searchFilter = {
        status: showNeedsSupportFilter ? ['READY_TO_WORK', 'SUPPORT_NEEDED'] : ['READY_TO_WORK'],
        typeOfWork: decodeURIComponent(typeOfWorkFilter.toString()),
        searchTerm: decodeURIComponent(prisonerNameFilter.toString()),
      }

      // Build date filter
      const dateFilter = {
        earliestReleaseDate: formatDateToyyyyMMdd(new Date().toString()),
        latestReleaseDate: offenderEarliestReleaseDate(weeksBeforeRelease),
        prisonIds: [userActiveCaseLoad.caseLoadId],
      }

      req.context.prisonerListMatchedJobs = await prisonerProfileService.getPrisonersToMatchJobs({
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

export default getPrisonerListMatchJobsResolver
