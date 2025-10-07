import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import logger from '../../../logger'
import getEmployersWithNationalJobs from './utils/getEmployersWithNationalJobs'

const getNationalEmployersListResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user

    try {
      // Get employers list
      const nationalEmployersList = await getEmployersWithNationalJobs(jobService, username)

      req.context.nationalEmployersList = nationalEmployersList

      next()
    } catch (err) {
      logger.error('Error getting data - National Employers List')
      next(err)
    }
  }

export default getNationalEmployersListResolver
