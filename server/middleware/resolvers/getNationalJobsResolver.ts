import type { RequestHandler } from 'express'

import JobService from '../../services/jobService'
import getMatchedJobs from './utils/getMatchedJobs'
import logger from '../../../logger'

const getNationalJobsResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const { offenceFilterEnabled } = res.locals
    const {
      page = '1',
      sort = '',
      order = '',
      jobSectorFilter = '',
      jobSectorFilterOther = '',
      employerFilter = '',
      offenceFilter = '',
    } = req.query

    try {
      const nationalJobs = await getMatchedJobs(jobService, username, {
        offenderNo: id,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        jobSectorFilter: [jobSectorFilter.toString(), jobSectorFilterOther.toString()].filter(Boolean).join(','),
        employerId: employerFilter.toString(),
        isNationalJob: true,
        offenceFilter: offenceFilterEnabled ? offenceFilter.toString() : null,
      })

      req.context.nationalJobsResults = nationalJobs

      next()
    } catch (err) {
      logger.error('Error getting data - National jobs')
      next(err)
    }
  }

export default getNationalJobsResolver
