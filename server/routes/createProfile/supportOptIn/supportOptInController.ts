import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/yesNoValue'

export default class SupportOptInController {
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
            ? addressLookup.createProfile.rightToWork(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        supportOptIn: record.supportOptIn,
      }

      // Store page data for use if validation fails
      req.session.data[`supportOptIn_${id}_data`] = data

      res.render('pages/createProfile/supportOptIn/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { supportOptIn } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`supportOptIn_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/supportOptIn/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        supportOptIn,
      }
      delete req.session.data[`supportOptIn_${id}_data`]

      // If NO redirect to ineligable-to-work
      if (supportOptIn === YesNoValue.No) {
        res.redirect(addressLookup.createProfile.supportDeclinedReason(id, mode))
        return
      }

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.alreadyInPlace(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
