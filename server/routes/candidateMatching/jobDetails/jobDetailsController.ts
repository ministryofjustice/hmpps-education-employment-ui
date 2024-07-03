/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import _ from 'lodash'
import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import addressLookup from '../../addressLookup'
import { getBackLocation } from '../../../utils/index'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class JobDetailsController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { jobDetails, prisoner, profile, prisonerAddress } = req.context

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
        matchesPrisonerInterests: _.get(
          profile,
          'profileData.supportAccepted.workInterests.workTypesOfInterest',
          [],
        ).includes(jobDetails.typeOfWork),
        releaseArea: prisonerAddress,
      }

      res.render('pages/candidateMatching/jobDetails/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
