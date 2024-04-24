import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getFlaggedJobs from './utils/getFlaggedJobs'

const getFlaggedJobsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const { page, sort = '', order = '' } = req.query

    try {
      const flaggedJobs = await getFlaggedJobs(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
      })

      req.context.flaggedJobsResults = flaggedJobs

      next()
    } catch (err) {
      next(err)
    }
  }

export default getFlaggedJobsResolver
