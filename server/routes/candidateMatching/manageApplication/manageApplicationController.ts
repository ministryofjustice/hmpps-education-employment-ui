/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import addressLookup from '../../addressLookup'
import { getBackLocation } from '../../../utils/index'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import ApplicationStatusViewModel from '../../../viewModels/applicationProgressViewModel'

export default class ManageApplicationController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, jobId, mode } = req.params
    const { jobDetails, prisoner, applicationProgress } = req.context

    try {
      // Render data
      const data = {
        id,
        mode,
        backLocation: getBackLocation({
          req,
          defaultRoute: addressLookup.candidateMatching.jobDetails(id, jobId),
          page: 'manageApplication',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        job: plainToClass(JobDetailsViewModel, jobDetails),
        applicationProgress: plainToClass(ApplicationStatusViewModel, applicationProgress),
      }

      res.render('pages/candidateMatching/manageApplication/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
