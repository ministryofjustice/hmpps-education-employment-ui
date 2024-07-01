import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getArchivedJobs from './utils/getArchivedJobs'

const getArchivedJobsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const { page, sort = '', order = '' } = req.query

    try {
      const archivedJobs = await getArchivedJobs(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
      })

      req.context.archivedJobsResults = archivedJobs

      next()
    } catch (err) {
      next(err)
    }
  }

export default getArchivedJobsResolver
