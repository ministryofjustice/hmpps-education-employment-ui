import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import { v7 as uuidv7 } from 'uuid'

import _ from 'lodash'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
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
import logger from '../../../../logger'
import config from '../../../config'

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

      const path = data.backLocation.split('?')[0]
      const isFromMatchedJobs =
        path.includes(addressLookup.candidateMatching.prisonerListMatchJobs()) || path.includes('/details')

      const journey = isFromMatchedJobs ? 'manageMatchedJobs' : 'manageApplication'

      // Set page data in session
      setSessionData(req, ['manageApplication', id, jobId, 'data'], data)

      res.render('pages/candidateMatching/manageApplication/index', { ...data, journey })
    } catch (err) {
      logger.error('Error rendering page - Manage application')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, jobId } = req.params
    const { applicationStatus, additionalInformation } = req.body
    const { userActiveCaseLoad } = res.locals
    const { prisoner, applicationProgress = [] } = req.context

    try {
      if (Object.prototype.hasOwnProperty.call(req.body, 'returnToApplicationsList')) {
        res.redirect(addressLookup.candidateMatching.prisonerListApplications())
        return
      }
      if (Object.prototype.hasOwnProperty.call(req.body, 'returnToJobMatchesList')) {
        res.redirect(`${addressLookup.candidateMatching.prisonerListMatchJobs()}?sort=releaseDate&order=ascending`)
        return
      }

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

      // Check for existing application ID
      const applicationId = applicationProgress.length
        ? (_.last(applicationProgress) as ApplicationStatusViewModel).id
        : uuidv7()

      if (config.apis.hmppsAudit.enabled) {
        await auditService.sendAuditMessage({
          action: 'UPDATE_APPLICATION',
          who: res.locals.user.username,
          subjectType: 'NOT_APPLICABLE',
          subjectId: applicationId,
          service: config.apis.hmppsAudit.auditServiceName,
          details: JSON.stringify({
            jobId,
            prisonNumber: id,
            applicationStatus,
          }),
        })
      }

      // Update application progress API
      await this.jobApplicationService.updateApplicationProgress(res.locals.user.username, applicationId, {
        jobId,
        prisonNumber: id,
        prisonId: userActiveCaseLoad.caseLoadId,
        firstName: prisoner.firstName,
        lastName: prisoner.lastName,
        applicationStatus,
        additionalInformation,
      })

      // Redirect to the correct page based on mode
      res.redirect(res.locals.withFrom(addressLookup.candidateMatching.manageApplication(id, jobId, 'view')))
    } catch (err) {
      logger.error('Error posting form - Manage application')
      next(err)
    }
  }
}
