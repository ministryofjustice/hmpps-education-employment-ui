import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import ProfileStatus from '../../../enums/profileStatus'
import YesNoValue from '../../../enums/yesNoValue'
import PrisonerProfileService from '../../../services/prisonerProfileService'

export default class NewStatusController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner, profile } = req.context

    try {
      if (!profile) {
        res.redirect(addressLookup.workProfile(id))
        return
      }

      // Get record in sessionData
      const record = getSessionData(req, ['changeStatus', id], {})

      const data = {
        backLocation: addressLookup.workProfile(id),
        prisoner,
        newStatus: record.newStatus || profile.profileData.status,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['newStatus', id, 'data'], data)

      res.render('pages/changeStatus/newStatus/index', { ...data })
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
        res.render('pages/changeStatus/newStatus/index', {
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
        res.redirect(addressLookup.workProfile(id))
        return
      }

      // Status only change
      if (this.isStatusOnlyChange(newStatus, profile.profileData.status)) {
        // Call api, change status
        await this.prisonerProfileService.updateProfile(
          res.locals.user.token,
          {
            prisonerId: id,
            bookingId: prisoner.bookingId,
            status: ProfileStatus.NO_RIGHT_TO_WORK,
            currentUser: res.locals.user.username,
          },
          profile,
        )

        // Redirect to work profile
        res.redirect(addressLookup.workProfile(id))
        return
      }

      if (newStatus === ProfileStatus.SUPPORT_DECLINED) {
        // Set defaults for flow
        setSessionData(req, ['createProfile', id], {
          rightToWork: YesNoValue.YES,
          supportOptIn: YesNoValue.NO,
        })

        // Redirect to work profile
        res.redirect(`${addressLookup.createProfile.supportDeclinedReason(id)}?from=${req.originalUrl}`)
        return
      }

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.changeStatus.newStatusPause(id))
    } catch (err) {
      next(err)
    }
  }

  private isStatusOnlyChange(newStatus: string, existingStatus: string) {
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
