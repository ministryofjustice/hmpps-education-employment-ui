import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getJobDetails from './utils/getJobDetails'

const getJobDetailsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { jobId } = req.params

    try {
      const jobDetails = await getJobDetails(jobService, username, jobId)

      req.context.jobDetails = jobDetails

      next()
    } catch (err) {
      next(err)
    }
  }

export default getJobDetailsResolver
