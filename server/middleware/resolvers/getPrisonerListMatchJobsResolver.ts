/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from 'express'

import _ from 'lodash'
import {
  formatDateToyyyyMMdd,
  generateHash,
  getSessionData,
  offenderEarliestReleaseDate,
  setSessionData,
} from '../../utils/index'
import PrisonerProfileService from '../../services/prisonerProfileService'
import getPrisonerAddressById from './utils/getPrisonerAddressById'
import DeliusIntegrationService from '../../services/deliusIntegrationService'
import logger from '../../../logger'
import PrisonerSearchService from '../../services/prisonSearchService'
import GetPrisonerByIdResult from '../../data/prisonerSearch/getPrisonerByIdResult'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerListMatchJobsResolver =
  (
    prisonerProfileService: PrisonerProfileService,
    deliusIntegrationService: DeliusIntegrationService,
    prisonerSearchService: PrisonerSearchService,
  ): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { page, sort, order, showNeedsSupportFilter, prisonerNameFilter = '', typeOfWorkFilter = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { username, token } = res.locals.user

    try {
      // Build search filter
      const searchFilter = {
        status: showNeedsSupportFilter ? ['READY_TO_WORK', 'SUPPORT_NEEDED'] : ['READY_TO_WORK'],
        typeOfWork: decodeURIComponent(typeOfWorkFilter.toString()),
        searchTerm: decodeURIComponent(prisonerNameFilter.toString()),
      }

      // Build date filter
      const dateFilter = {
        earliestReleaseDate: formatDateToyyyyMMdd(new Date().toString()),
        latestReleaseDate: offenderEarliestReleaseDate(5200),
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

      req.context.prisonerListMatchedJobs = await prisonerProfileService.getPrisonersToMatchJobs({
        userToken: token,
        username,
        dateFilter,
        searchFilter,
        sort,
        order,
        page: page ? +page - 1 : 0,
        offenders,
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
