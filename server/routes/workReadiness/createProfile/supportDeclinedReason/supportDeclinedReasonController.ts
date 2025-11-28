import type { RequestHandler } from 'express'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import SupportDeclinedReasonValue from '../../../../enums/supportDeclinedReasonValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import getBackLocation from '../../../../utils/getBackLocation'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import UpdateProfileRequest from '../../../../data/models/updateProfileRequest'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import config from '../../../../config'

export default class SupportDeclinedReasonController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, profile } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (mode !== 'update' && !record) {
        res.redirect(addressLookup.workReadiness.createProfile.rightToWork(id, mode))
        return
      }

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new'
            ? addressLookup.workReadiness.createProfile.supportOptIn(id, mode)
            : addressLookup.workReadiness.createProfile.checkAnswers(id),
        page: 'supportDeclinedReason',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        supportDeclinedReason:
          mode === 'update'
            ? profile.profileData.supportDeclined.supportToWorkDeclinedReason
            : record.supportDeclinedReason || [],
        supportDeclinedDetails:
          mode === 'update'
            ? profile.profileData.supportDeclined.supportToWorkDeclinedReasonOther
            : record.supportDeclinedDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['supportDeclinedReason', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/supportDeclinedReason/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { supportDeclinedReason = [], supportDeclinedDetails } = req.body
    const { prisoner, profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['supportDeclinedReason', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/supportDeclinedReason/index', {
          ...data,
          errors,
          supportDeclinedReason,
          supportDeclinedDetails,
        })
        return
      }

      deleteSessionData(req, ['supportDeclinedReason', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportDeclined = {
          ...profile.profileData.supportDeclined,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          supportToWorkDeclinedReason: supportDeclinedReason,
          supportToWorkDeclinedReasonOther: supportDeclinedDetails,
        }

        // Audit edit profile
        if (config.apis.hmppsAudit.enabled) {
          await auditService.sendAuditMessage({
            action: 'EDIT_WORK_PROFILE',
            who: res.locals.user.username,
            subjectType: 'PRISONER_ID',
            subjectId: prisoner.prisonerNumber,
            service: config.apis.hmppsAudit.auditServiceName,
          })
        }

        // Call api, change status
        await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

        // Return to current profile
        const module = getSessionData(req, ['workProfile', id, 'currentModule'], 'wr')
        res.redirect(addressLookup.workProfile(id, 'overview', module))
        return
      }

      // Default flow Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        supportDeclinedReason,
        supportDeclinedDetails: supportDeclinedReason.includes(SupportDeclinedReasonValue.OTHER)
          ? supportDeclinedDetails
          : '',
      })

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.workReadiness.createProfile.whatNeedsToChange(id, mode)
          : addressLookup.workReadiness.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
