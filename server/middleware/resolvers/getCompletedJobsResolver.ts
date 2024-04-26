import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getJobDetails from './utils/getJobDetails'

const getCompleteJobsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { employerName = '', jobTitle = '', city = '' } = req.query

    try {
      const jobDetails = await getJobDetails(jobService, username, {
        employerName: employerName.toString(),
        jobTitle: jobTitle.toString(),
        city: city.toString(),
      })

      req.context.jobDetailsResult = jobDetails

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCompleteJobsResolver
