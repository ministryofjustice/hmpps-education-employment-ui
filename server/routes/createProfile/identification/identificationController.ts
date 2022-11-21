import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'

export default class IdentificationController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context
    const { from } = req.query

    try {
      // If no record return to rightToWork
      const record = req.session.data[`createProfile_${id}`]
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation:
          mode !== 'new' && from === 'checkAnswers'
            ? addressLookup.createProfile.checkAnswers(id)
            : addressLookup.createProfile.alreadyInPlace(id, mode),
        prisoner,
        identification: record.identification || [],
      }

      // Store page data for use if validation fails
      req.session.data[`identification_${id}_data`] = data

      res.render('pages/createProfile/identification/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { identification = [] } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`identification_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/identification/index', {
          ...data,
          errors,
          identification,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        identification,
      }
      delete req.session.data[`identification_${id}_data`]

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.abilityToWork(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
