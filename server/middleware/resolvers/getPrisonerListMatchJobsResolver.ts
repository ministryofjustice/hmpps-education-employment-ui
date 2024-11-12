/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from 'express'

import _ from 'lodash'
import config from '../../config'
import { formatDateToyyyyMMdd, getSessionData, offenderEarliestReleaseDate, setSessionData } from '../../utils/index'
import PrisonerProfileService from '../../services/prisonerProfileService'
import getPrisonerAddressById from './utils/getPrisonerAddressById'
import DeliusIntegrationService from '../../services/deliusIntegrationService'
import logger from '../../../logger'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerListMatchJobsResolver =
  (
    prisonerProfileService: PrisonerProfileService,
    deliusIntegrationService: DeliusIntegrationService,
  ): RequestHandler =>
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

      // Get postcodes in parallel for any results
      if (req.context.prisonerListMatchedJobs.content && req.context.prisonerListMatchedJobs.content.length) {
        // Set up promises
        const promises = req.context.prisonerListMatchedJobs.content.map(
          async (prisoner: { prisonerNumber: string }) => {
            let address

            // Check session for cached address
            if (getSessionData(req, ['prisonerAddress', prisoner.prisonerNumber])) {
              address = getSessionData(req, ['prisonerAddress', prisoner.prisonerNumber])
            } else {
              address = await getPrisonerAddressById(deliusIntegrationService, username, prisoner.prisonerNumber)
              setSessionData(req, ['prisonerAddress', prisoner.prisonerNumber], address)
            }

            return address
          },
        )

        // Process requests
        const results = await Promise.all(promises)

        // Merge results
        req.context.prisonerListMatchedJobs.content = req.context.prisonerListMatchedJobs.content.map(
          (prisoner: any, index: number) => ({
            ...prisoner,
            postcode: _.get(results[index], 'postcode', ''),
          }),
        )
      }

      next()
    } catch (err) {
      logger.error('Error getting data - Prisoner list match jobs')
      next(err)
    }
  }

export default getPrisonerListMatchJobsResolver
