import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getMatchedJobs from './utils/getMatchedJobs'

const getMatchedJobsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const { page, sort = '', order = '', typeOfWorkFilter = '', locationFilter = '', distanceFilter = '10' } = req.query

    try {
      const matchedJobs = await getMatchedJobs(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        typeOfWorkFilter: typeOfWorkFilter.toString(),
        locationFilter: locationFilter.toString(),
        distanceFilter: Number(distanceFilter),
      })

      req.context.matchedJobsResults = matchedJobs

      next()
    } catch (err) {
      next(err)
    }
  }

export default getMatchedJobsResolver
