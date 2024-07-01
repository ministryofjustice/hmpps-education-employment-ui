/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import JobApplicationService from '../../services/jobApplicationService'
import PrisonerApplicationViewModel from '../../viewModels/prisonerApplicationViewModel'
import getPrisonerListApplications from './utils/getPrisonerListApplications'

// Gets prisoner applications based on the current prisonId of the current user
const getPrisonerListApplicationsResolver =
  (jobApplicationService: JobApplicationService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const {
      page,
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
        prisonId: userActiveCaseLoad,
        page: Number(page) || 0,
        sort: sort.toString(),
        order: order.toString(),
        applicationStatusFilter: decodeURIComponent(applicationStatusFilter.toString()),
        prisonerNameFilter: decodeURIComponent(prisonerNameFilter.toString()),
        jobFilter: decodeURIComponent(jobFilter.toString()),
      })

      req.context.prisonerListApplications = applications
      req.context.prisonerListApplications.content = plainToClass(PrisonerApplicationViewModel, applications.content)
      next()
    } catch (err) {
      next(err)
    }
  }

export default getPrisonerListApplicationsResolver
