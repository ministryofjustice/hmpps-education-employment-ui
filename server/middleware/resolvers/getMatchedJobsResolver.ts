import type { RequestHandler } from 'express'
import _ from 'lodash'

import JobService from '../../services/jobService'
import getMatchedJobs from './utils/getMatchedJobs'
import logger from '../../../logger'

const getMatchedJobsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const {
      page = '1',
      sort = '',
      order = '',
      jobSectorFilter = '',
      locationFilter = '',
      distanceFilter = '50',
      isNationalJob = 'false',
    } = req.query
    const { prisonerAddress } = req.context

    try {
      // Get default release area postcode
      const postcode = _.get(prisonerAddress, 'postcode', '')

      const matchedJobs = await getMatchedJobs(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        jobSectorFilter: jobSectorFilter.toString(),
        locationFilter: locationFilter.toString() === 'none' ? '' : locationFilter.toString() || postcode,
        distanceFilter: Number(distanceFilter) ? Number(distanceFilter) : null,
        isNationalJob: isNationalJob.toString() === 'true',
      })

      req.context.matchedJobsResults = matchedJobs

      next()
    } catch (err) {
      logger.error('Error getting data - Matched jobs')
      next(err)
    }
  }

export default getMatchedJobsResolver
