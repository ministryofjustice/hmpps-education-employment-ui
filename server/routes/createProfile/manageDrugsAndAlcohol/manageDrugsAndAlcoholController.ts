import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'

export default class ManageDrugsAndAlcoholController {
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
        backLocation: addressLookup.createProfile.abilityToWork(id, mode),
        prisoner,
        manageDrugsAndAlcohol: record.manageDrugsAndAlcohol,
      }

      // Store page data for use if validation fails
      req.session.data[`manageDrugsAndAlcohol_${id}_data`] = data

      res.render('pages/createProfile/manageDrugsAndAlcohol/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { manageDrugsAndAlcohol } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`manageDrugsAndAlcohol_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/manageDrugsAndAlcohol/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        manageDrugsAndAlcohol,
      }
      delete req.session.data[`manageDrugsAndAlcohol_${id}_data`]

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.typeOfWork(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
