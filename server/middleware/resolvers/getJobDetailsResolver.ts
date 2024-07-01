import type { RequestHandler } from 'express'
import _ from 'lodash'

import JobService from '../../services/jobService'
import getJobDetails from './utils/getJobDetails'
import { getSessionData } from '../../utils/session'

const getJobDetailsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { id, jobId } = req.params

    try {
      // Check for postcode
      const postcode = _.get(getSessionData(req, ['prisonerAddress', id], {}), 'postcode')

      // Get job details
      const jobDetails = await getJobDetails(jobService, username, jobId, postcode)
      req.context.jobDetails = jobDetails

      next()
    } catch (err) {
      next(err)
    }
  }

export default getJobDetailsResolver
