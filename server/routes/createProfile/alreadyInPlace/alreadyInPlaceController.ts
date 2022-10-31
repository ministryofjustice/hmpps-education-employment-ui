import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'

export default class AlreadyInPlaceController {
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
            ? addressLookup.createProfile.supportOptIn(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        alreadyInPlace: record.alreadyInPlace || [],
      }

      // Store page data for use if validation fails
      req.session.data[`alreadyInPlace_${id}_data`] = data

      res.render('pages/createProfile/alreadyInPlace/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { alreadyInPlace = [] } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`alreadyInPlace_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/alreadyInPlace/index', {
          ...data,
          errors,
          alreadyInPlace,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        alreadyInPlace,
      }
      delete req.session.data[`alreadyInPlace_${id}_data`]

      if (alreadyInPlace.includes(AlreadyInPlaceValue.ID)) {
        res.redirect(addressLookup.createProfile.identification(id, mode))
        return
      }

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