import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getArchivedJobs from './utils/getArchivedJobs'
import { getSessionData, setSessionData } from '../../utils/session'
import getPrisonerAddressById from './utils/getPrisonerAddressById'
import DeliusIntegrationService from '../../services/deliusIntegrationService'
import logger from '../../../logger'

const getArchivedJobsResolver =
  (jobService: JobService, deliusIntegrationService: DeliusIntegrationService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const { page = '1', sort = '', order = '' } = req.query

    try {
      // Check for address
      if (getSessionData(req, ['prisonerAddress', id])) {
        req.context.prisonerAddress = getSessionData(req, ['prisonerAddress', id])
      } else {
        req.context.prisonerAddress = await getPrisonerAddressById(deliusIntegrationService, username, id)
        setSessionData(req, ['prisonerAddress', id], req.context.prisonerAddress)
      }

      // Get jobs
      const archivedJobs = await getArchivedJobs(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        locationFilter: req.context.prisonerAddress ? req.context.prisonerAddress.postcode : '',
      })

      req.context.archivedJobsResults = archivedJobs

      next()
    } catch (err) {
      logger.error('Error getting data - Archived jobs')
      next(err)
    }
  }

export default getArchivedJobsResolver
