import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getJobsOfInterest from './utils/getJobsOfInterest'

const getJobsOfInterestResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const { page, sort = '', order = '' } = req.query

    try {
      const jobsOfInterest = await getJobsOfInterest(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
      })

      req.context.jobsOfInterestResults = jobsOfInterest

      next()
    } catch (err) {
      next(err)
    }
  }

export default getJobsOfInterestResolver
