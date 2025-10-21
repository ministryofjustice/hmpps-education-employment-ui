import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import WhatNeedsToChangeValue from '../../../../enums/whatNeedsToChangeValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../../utils/getBackLocation'
import UpdateProfileRequest from '../../../../data/models/updateProfileRequest'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import isWithin12Weeks from '../../../../utils/isWithin12Weeks'

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
            ? addressLookup.workReadiness.createProfile.supportDeclinedReason(id, mode)
            : addressLookup.workReadiness.createProfile.checkAnswers(id),
        page: 'whatNeedsToChange',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        whatNeedsToChange:
          mode === 'update'
            ? profile.profileData.supportDeclined.circumstanceChangesRequiredToWork
            : record.whatNeedsToChange || [],
        whatNeedsToChangeDetails:
          mode === 'update'
            ? profile.profileData.supportDeclined.circumstanceChangesRequiredToWorkOther
            : record.whatNeedsToChangeDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['whatNeedsToChange', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/whatNeedsToChange/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { whatNeedsToChange = [], whatNeedsToChangeDetails } = req.body
    const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['whatNeedsToChange', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/whatNeedsToChange/index', {
          ...data,
          errors,
          whatNeedsToChange,
          whatNeedsToChangeDetails,
        })
        return
      }

      deleteSessionData(req, ['whatNeedsToChange', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportDeclined = {
          ...profile.profileData.supportDeclined,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          circumstanceChangesRequiredToWork: whatNeedsToChange,
          circumstanceChangesRequiredToWorkOther: whatNeedsToChangeDetails,
        }

        // Call api, change status
        await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

        // Return to current profile
        const module = getSessionData(req, ['workProfile', id, 'currentModule'], 'wr')
        res.redirect(addressLookup.workProfile(id, 'overview', module))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        whatNeedsToChange,
        whatNeedsToChangeDetails: whatNeedsToChange.includes(WhatNeedsToChangeValue.OTHER)
          ? whatNeedsToChangeDetails
          : '',
      })

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.workReadiness.createProfile.checkAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
