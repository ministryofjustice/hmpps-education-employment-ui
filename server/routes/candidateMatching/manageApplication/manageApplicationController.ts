import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import addressLookup from '../../addressLookup'
import {
  decryptUrlParameter,
  encryptUrlParameter,
  getBackLocation,
  getSessionData,
  setSessionData,
  validateFormSchema,
} from '../../../utils/index'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import ApplicationStatusViewModel from '../../../viewModels/applicationProgressViewModel'
import validationSchema from './validationSchema'
import JobApplicationService from '../../../services/jobApplicationService'

export default class ManageApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, jobId, mode } = req.params
    const { from = '' } = req.query
    const { jobDetails, prisoner, applicationProgress = [] } = req.context

    try {
      if (applicationProgress.length === 0 && mode === 'view') {
        res.redirect(
          from
            ? `${addressLookup.candidateMatching.manageApplication(id, jobId, 'update')}?from=${encryptUrlParameter(
                decryptUrlParameter(from.toString()),
              )}`
            : addressLookup.candidateMatching.manageApplication(id, jobId, 'update'),
        )
        return
      }

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

      // Set page data in session
      setSessionData(req, ['manageApplication', id, jobId, 'data'], data)

      res.render('pages/candidateMatching/manageApplication/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, jobId } = req.params
    const { applicationStatus, additionalInformation } = req.body
    const { userActiveCaseLoad } = res.locals
    const { prisoner } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['manageApplication', id, jobId, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/candidateMatching/manageApplication/index', {
          ...data,
          ...req.body,
          errors,
        })
        return
      }

      // Update application progress API
      await this.jobApplicationService.updateApplicationProgress(res.locals.user.username, {
        offenderNo: id,
        prisonId: userActiveCaseLoad.caseLoadId,
        jobId: Number(jobId),
        firstName: prisoner.firstName,
        lastName: prisoner.lastName,
        applicationStatus,
        additionalInformation,
      })

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.candidateMatching.manageApplication(id, jobId, 'update'))
    } catch (err) {
      next(err)
    }
  }
}
