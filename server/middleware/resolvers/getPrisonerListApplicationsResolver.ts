/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import JobApplicationService from '../../services/jobApplicationService'
import PrisonerApplicationViewModel from '../../viewModels/prisonerApplicationViewModel'
import getPrisonerListApplications from './utils/getPrisonerListApplications'
import logger from '../../../logger'

// Gets prisoner applications based on the current prisonId of the current user
const getPrisonerListApplicationsResolver =
  (jobApplicationService: JobApplicationService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const {
      page = '1',
      sort = '',
      order = '',
      applicationStatusFilter = '',
      prisonerNameFilter = '',
      jobFilter = '',
    } = req.query
    const { userActiveCaseLoad } = res.locals
    const { username } = res.locals.user

    try {
      const applications = await getPrisonerListApplications(jobApplicationService, username, {
        prisonId: userActiveCaseLoad.caseLoadId,
        page: Number(page),
        sort: sort.toString(),
        order: order.toString(),
        applicationStatusFilter: applicationStatusFilter.toString(),
        prisonerNameFilter: prisonerNameFilter.toString(),
        jobFilter: jobFilter.toString(),
      })

      req.context.prisonerListApplications = applications
      req.context.prisonerListApplications.content = plainToClass(PrisonerApplicationViewModel, applications.content)
      next()
    } catch (err) {
      logger.error('Error getting data - Prisoner list applications')
      next(err)
    }
  }

export default getPrisonerListApplicationsResolver
