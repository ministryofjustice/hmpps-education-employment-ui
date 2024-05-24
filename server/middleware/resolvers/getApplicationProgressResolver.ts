import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getApplicationProgress from './utils/getApplicationProgress'

const getApplicationProgressResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { id, jobId } = req.params

    try {
      const applicationProgress = await getApplicationProgress(jobService, username, id, jobId)

      req.context.applicationProgress = applicationProgress

      next()
    } catch (err) {
      next(err)
    }
  }

export default getApplicationProgressResolver
