import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import SupportDeclinedReasonValue from '../../../enums/supportDeclinedReasonValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'

export default class SupportDeclinedReasonController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation:
          mode === 'new'
            ? addressLookup.createProfile.supportOptIn(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        supportDeclinedReason: record.supportDeclinedReason || [],
        supportDeclinedDetails: record.supportDeclinedDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['supportDeclinedReason', id, 'data'], data)

      res.render('pages/createProfile/supportDeclinedReason/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { supportDeclinedReason = [], supportDeclinedDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['supportDeclinedReason', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/supportDeclinedReason/index', {
          ...data,
          errors,
          supportDeclinedReason,
          supportDeclinedDetails,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        supportDeclinedReason,
        supportDeclinedDetails: supportDeclinedReason.includes(SupportDeclinedReasonValue.OTHER)
          ? supportDeclinedDetails
          : '',
      })
      deleteSessionData(req, ['supportDeclinedReason', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.whatNeedsToChange(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
