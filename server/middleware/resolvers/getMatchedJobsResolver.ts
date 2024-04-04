import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getMatchedJobs from './utils/getMatchedJobs'

const getMatchedJobsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      const matchedJobs = getMatchedJobs(jobService, username, id)

      req.context.matchedJobs = matchedJobs

      next()
    } catch (err) {
      next(err)
    }
  }

export default getMatchedJobsResolver
