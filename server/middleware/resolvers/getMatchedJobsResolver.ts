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
      jobSectorFilterOther = '',
      locationFilter = '',
      distanceFilter = '50',
      isNationalJob = 'false',
      offenceFilter = '',
    } = req.query
    const { prisonerAddress } = req.context
    const { offenceFilterEnabled } = res.locals

    try {
      // Get default release area postcode
      const postcode = _.get(prisonerAddress, 'postcode', '')

      const matchedJobs = await getMatchedJobs(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        jobSectorFilter: [jobSectorFilter.toString(), jobSectorFilterOther.toString()].filter(Boolean).join(','),
        locationFilter: locationFilter.toString() === 'none' ? '' : locationFilter.toString() || postcode,
        distanceFilter: Number(distanceFilter) ? Number(distanceFilter) : null,
        isNationalJob: isNationalJob.toString() === 'true',
        offenceFilter: offenceFilterEnabled ? offenceFilter.toString() : null,
      })

      req.context.matchedJobsResults = matchedJobs

      next()
    } catch (err) {
      logger.error('Error getting data - Matched jobs')
      next(err)
    }
  }

export default getMatchedJobsResolver
