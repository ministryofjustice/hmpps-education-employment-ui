import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import WhatNeedsToChangeValue from '../../../enums/whatNeedsToChangeValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'

export default class SupportDeclinedReasonController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, profile } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (mode !== 'update' && !record) {
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation: getBackLocation({
          req,
          defaultRoute:
            mode === 'new'
              ? addressLookup.createProfile.supportDeclinedReason(id, mode)
              : addressLookup.createProfile.checkAnswers(id),
          page: 'whatNeedsToChange',
          uid: id,
        }),
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

      res.render('pages/createProfile/whatNeedsToChange/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { whatNeedsToChange = [], whatNeedsToChangeDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['whatNeedsToChange', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/whatNeedsToChange/index', {
          ...data,
          errors,
          whatNeedsToChange,
          whatNeedsToChangeDetails,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        whatNeedsToChange,
        whatNeedsToChangeDetails: whatNeedsToChange.includes(WhatNeedsToChangeValue.OTHER)
          ? whatNeedsToChangeDetails
          : '',
      })
      deleteSessionData(req, ['whatNeedsToChange', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.createProfile.checkAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
