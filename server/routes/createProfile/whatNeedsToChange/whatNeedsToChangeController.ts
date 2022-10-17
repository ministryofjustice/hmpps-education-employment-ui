import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import whatNeedsToChangeValue from '../../../enums/whatNeedsToChangeValue'

export default class SupportDeclinedReasonController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = req.session.data[`createProfile_${id}`]
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation:
          mode === 'new'
            ? addressLookup.createProfile.supportDeclinedReason(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        whatNeedsToChange: record.whatNeedsToChange || [],
        whatNeedsToChangeDetails: record.whatNeedsToChangeDetails,
      }

      // Store page data for use if validation fails
      req.session.data[`whatNeedsToChange_${id}_data`] = data

      res.render('pages/createProfile/whatNeedsToChange/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { whatNeedsToChange = [], whatNeedsToChangeDetails } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`whatNeedsToChange_${id}_data`]
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
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        whatNeedsToChange,
        whatNeedsToChangeDetails: whatNeedsToChange.includes(whatNeedsToChangeValue.OTHER)
          ? whatNeedsToChangeDetails
          : '',
      }
      delete req.session.data[`whatNeedsToChange_${id}_data`]

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.createProfile.checkAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
