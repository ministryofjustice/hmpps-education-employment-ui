import type { RequestHandler } from 'express'
import _ from 'lodash'

import JobService from '../../services/jobService'
import getJobDetails from './utils/getJobDetails'
import { getSessionData } from '../../utils/session'
import getEmployer from './utils/getEmployer'
import logger from '../../../logger'

const getJobDetailsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { id, jobId } = req.params

    try {
      // Check for postcode
      const postcode = _.get(getSessionData(req, ['prisonerAddress', id], {}), 'postcode')

      // Get job details
      const jobDetails = await getJobDetails(jobService, username, jobId, id, postcode)

      // Get employer name
      if (jobDetails.employerId) {
        const employer = await getEmployer(jobService, username, jobDetails.employerId)

        jobDetails.employerName = employer?.name
      }

      req.context.jobDetails = jobDetails

      next()
    } catch (err) {
      logger.error('Error getting data - Job details')
      next(err)
    }
  }

export default getJobDetailsResolver
