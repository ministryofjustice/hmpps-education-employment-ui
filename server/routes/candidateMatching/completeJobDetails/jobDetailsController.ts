/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import _ from 'lodash'
import { plainToClass } from 'class-transformer'

import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import addressLookup from '../../addressLookup'

export default class JobDetailsController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    let { jobDetailsResult } = req.context

    try {
      // Transform jobs to View Model
      jobDetailsResult = plainToClass(JobDetailsViewModel, _.get(jobDetailsResult, '', ''))

      // Render data
      const data = {
        id,
        backLocation: addressLookup.candidateMatching.workProfile(id),
        jobDetailsResult,
      }

      res.render('pages/candidateMatching/completeJobDetails/index', { ...data })
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
