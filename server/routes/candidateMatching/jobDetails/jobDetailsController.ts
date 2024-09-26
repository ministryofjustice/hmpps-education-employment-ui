/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import _ from 'lodash'
import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import addressLookup from '../../addressLookup'
import { getBackLocation, setSessionData } from '../../../utils/index'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import JobService from '../../../services/jobService'

export default class JobDetailsController {
  constructor(private readonly jobService: JobService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { print } = req.query
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
        ).includes(jobDetails.sector),
        releaseArea: prisonerAddress,
      }

      setSessionData(req, ['jobDetails', id, 'data'], data)

      res.render(print ? 'pages/candidateMatching/jobDetails/print' : 'pages/candidateMatching/jobDetails/index', {
        ...data,
      })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { jobId, id } = req.params
    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'createArchiveRecord')) {
        await this.jobService.createArchiveRecord(res.locals.user.username, jobId, id)
      }

      if (Object.prototype.hasOwnProperty.call(req.body, 'deleteArchiveRecord')) {
        await this.jobService.deleteArchiveRecord(res.locals.user.username, jobId, id)
      }

      if (Object.prototype.hasOwnProperty.call(req.body, 'createExpressionOfInterest')) {
        await this.jobService.createExpressionOfInterest(res.locals.user.username, jobId, id)
      }

      if (Object.prototype.hasOwnProperty.call(req.body, 'deleteExpressionOfInterest')) {
        await this.jobService.deleteExpressionOfInterest(res.locals.user.username, jobId, id)
      }

      res.redirect(req.originalUrl)
    } catch (err) {
      next(err)
    }
  }
}
