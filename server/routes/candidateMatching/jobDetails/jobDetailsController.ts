/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import addressLookup from '../../addressLookup'
import { getBackLocation } from '../../../utils/index'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class JobDetailsController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { jobDetails, prisoner } = req.context

    try {
      // Render data
      const data = {
        id,
        backLocation: getBackLocation({
          req,
          defaultRoute: addressLookup.candidateMatching.matchedJobs(id),
          page: 'jobDetails',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        job: plainToClass(JobDetailsViewModel, jobDetails),
      }

      res.render('pages/candidateMatching/jobDetails/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      res.redirect(addressLookup.candidateMatching.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
