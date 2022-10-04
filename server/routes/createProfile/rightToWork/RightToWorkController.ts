import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/YesNoValue'

export default class RightToWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // Get record in sessionData
      const record = req.session.data[`createProfile_${id}`] || {}

      const data = {
        backLocation: mode === 'new' ? addressLookup.workProfile(id) : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        rightToWork: record.rightToWork,
      }

      // Store page data for use if validation fails
      req.session.data[`rightToWork_${id}_data`] = data

      res.render('pages/createProfile/rightToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { rightToWork } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`rightToWork_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/rightToWork/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`] || {}
      req.session.data[`createProfile_${id}`] = {
        ...record,
        rightToWork,
      }
      delete req.session.data[`rightToWork_${id}_data`]

      // If NO redirect to ineligable-to-work
      if (rightToWork === YesNoValue.No) {
        res.redirect(addressLookup.createProfile.ineligableToWork(id))
        return
      }

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.supportOptIn(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
