import type { RequestHandler } from 'express'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import ProfileStatus from '../../../../enums/profileStatus'
import YesNoValue from '../../../../enums/yesNoValue'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import EditProfileRequest from '../../../../data/models/editProfileRequest'
import PrisonerProfile from '../../../../data/prisonerProfile/interfaces/prisonerProfile'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import { encryptUrlParameter } from '../../../../utils/urlParameterEncryption'
import isWithin12Weeks from '../../../../utils/isWithin12Weeks'
import config from '../../../../config'

export default class NewStatusController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner, profile } = req.context

    try {
      if (!profile) {
        res.redirect(addressLookup.workProfile(id, 'overview'))
        return
      }

      // Get record in sessionData
      const record = getSessionData(req, ['changeStatus', id], {})

      // Setup back location
      const module = getSessionData(req, ['workProfile', id, 'currentModule'], 'wr')
      const backLocation = addressLookup.workProfile(id, 'overview', module)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        newStatus: record.newStatus || profile.profileData.status,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['newStatus', id, 'data'], data)

      res.render('pages/workReadiness/changeStatus/newStatus/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { newStatus } = req.body
    const { profile, prisoner } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['newStatus', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/changeStatus/newStatus/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      setSessionData(req, ['changeStatus', id], {
        newStatus,
      })
      deleteSessionData(req, ['newStatus', id, 'data'])

      // Matching status no change
      if (newStatus === profile.profileData.status) {
        // Return to current profile
        const module = getSessionData(req, ['workProfile', id, 'currentModule'], 'wr')
        res.redirect(addressLookup.workProfile(id, 'overview', module))
        return
      }

      // Indicate whether releaseDate is within 12 weeks or not
      profile.profileData.within12Weeks = isWithin12Weeks(data.prisoner.nonDtoReleaseDate)
      profile.profileData.prisonId = data.prisoner.prisonId

      // Status only change
      if (this.isStatusOnlyChange(newStatus, profile.profileData.status, profile)) {
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
        await this.prisonerProfileService.updateProfile(
          res.locals.user.token,
          id,
          new EditProfileRequest(
            {
              prisonerId: id,
              bookingId: prisoner.bookingId,
              status: newStatus,
              currentUser: res.locals.user.username,
              prisonId: prisoner.prisonId,
              within12Weeks: profile.profileData.within12Weeks,
            },
            profile,
          ),
        )

        // Return to current profile
        const module = getSessionData(req, ['workProfile', id, 'currentModule'], 'wr')
        res.redirect(addressLookup.workProfile(id, 'overview', module))
        return
      }

      if (newStatus === ProfileStatus.SUPPORT_DECLINED) {
        // Set defaults for flow
        setSessionData(req, ['createProfile', id], {
          rightToWork: YesNoValue.YES,
          supportOptIn: YesNoValue.NO,
        })

        // Redirect to work profile
        res.redirect(
          `${addressLookup.workReadiness.createProfile.supportDeclinedReason(id)}?from=${encryptUrlParameter(
            req.originalUrl,
          )}`,
        )
        return
      }

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.workReadiness.changeStatus.newStatusPause(id))
    } catch (err) {
      next(err)
    }
  }

  private isStatusOnlyChange(newStatus: string, existingStatus: string, profile: PrisonerProfile) {
    if (
      (newStatus === ProfileStatus.SUPPORT_NEEDED || newStatus === ProfileStatus.READY_TO_WORK) &&
      profile.profileData.supportAccepted
    ) {
      return true
    }

    if (newStatus === ProfileStatus.NO_RIGHT_TO_WORK) {
      return true
    }

    if (existingStatus === ProfileStatus.READY_TO_WORK) {
      if (newStatus === ProfileStatus.SUPPORT_NEEDED) {
        return true
      }
    }

    if (existingStatus === ProfileStatus.SUPPORT_NEEDED) {
      if (newStatus === ProfileStatus.READY_TO_WORK) {
        return true
      }
    }

    return false
  }
}
