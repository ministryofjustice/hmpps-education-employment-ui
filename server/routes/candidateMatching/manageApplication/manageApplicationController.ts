/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import addressLookup from '../../addressLookup'
import { getBackLocation } from '../../../utils/index'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class ManageApplicationController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, jobId, mode } = req.params
    const { jobDetails, prisoner } = req.context

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
      }

      res.render('pages/candidateMatching/manageApplication/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
