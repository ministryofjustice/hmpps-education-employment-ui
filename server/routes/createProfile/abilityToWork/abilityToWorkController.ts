import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import abilityToWorkValue from '../../../enums/abilityToWorkValue'
import alreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'

export default class AbilityToWorkController {
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

      // Calculate last page based on record in session
      const lastPage =
        record.alreadyInPlace === alreadyInPlaceValue.ID
          ? addressLookup.createProfile.identification(id, mode)
          : addressLookup.createProfile.alreadyInPlace(id, mode)

      const data = {
        backLocation: mode === 'new' ? lastPage : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        abilityToWork: record.abilityToWork || [],
      }

      // Store page data for use if validation fails
      req.session.data[`abilityToWork_${id}_data`] = data

      res.render('pages/createProfile/abilityToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { abilityToWork = [] } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`abilityToWork_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/abilityToWork/index', {
          ...data,
          errors,
          abilityToWork,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        abilityToWork,
      }
      delete req.session.data[`abilityToWork_${id}_data`]

      if (abilityToWork.includes(abilityToWorkValue.DRUGS_OR_ALCOHOL)) {
        res.redirect(addressLookup.createProfile.manageDrugsAndAlcohol(id, mode))
        return
      }

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
