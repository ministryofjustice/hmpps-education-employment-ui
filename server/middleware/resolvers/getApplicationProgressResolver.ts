import type { RequestHandler } from 'express'

import getApplicationProgress from './utils/getApplicationProgress'
import JobApplicationService from '../../services/jobApplicationService'

const getApplicationProgressResolver =
  (jobApplicationService: JobApplicationService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { id, jobId } = req.params

    try {
      const applicationProgress = await getApplicationProgress(jobApplicationService, username, id, jobId)

      req.context.applicationProgress = applicationProgress

      next()
    } catch (err) {
      next(err)
    }
  }

export default getApplicationProgressResolver
