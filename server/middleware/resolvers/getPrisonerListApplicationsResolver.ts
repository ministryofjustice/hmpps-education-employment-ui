/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RequestHandler } from 'express'

import JobApplicationService from '../../services/jobApplicationService'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerListApplicationsResolver =
  (jobApplicationService: JobApplicationService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    // const { page, sort, order, applicationStatusFilter, prisonerNameFilter = '', jobFilter = '' } = req.query
    // const { userActiveCaseLoad } = res.locals
    // const { username, token } = res.locals.user

    try {
      req.context.prisonerListApplications = {
        content: [
          {
            jobId: 1,
            jobTitle: 'Vegetable packing operative',
            prisonerNumber: 'G5823GP',
            employerName: 'CBS packing',
            firstName: 'Adam',
            lastName: 'Arhmed',
            displayName: 'Adam Arhmed',
            applicationStatus: 'APPLICATION_MADE',
          },
          {
            jobId: 1,
            jobTitle: 'Forklift operator',
            prisonerNumber: 'G3892UH',
            employerName: 'Amazon',
            firstName: 'Charles',
            lastName: 'Jermaine',
            displayName: 'Charles Jermaine',
            applicationStatus: 'SELECTED_FOR_INTERVIEW',
          },
          {
            jobId: 1,
            jobTitle: 'Retail assistant',
            prisonerNumber: 'G3892UH',
            employerName: 'Iceland',
            firstName: 'Charles',
            lastName: 'Jermaine',
            displayName: 'Charles Jermaine',
            applicationStatus: 'APPLICATION_MADE',
          },
          {
            jobId: 1,
            jobTitle: 'Retail assistant',
            prisonerNumber: 'G0143VW',
            employerName: 'Iceland',
            firstName: 'Ross',
            lastName: 'McLaughlan',
            displayName: 'Ross McLaughlan',
            applicationStatus: 'APPLICATION_MADE',
          },
        ],
        totalElements: 4,
      }

      next()
    } catch (err) {
      next(err)
    }
  }

export default getPrisonerListApplicationsResolver
