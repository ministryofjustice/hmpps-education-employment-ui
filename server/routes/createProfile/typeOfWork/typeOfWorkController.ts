import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TypeOfWorkValue from '../../../enums/typeOfWorkValue'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

export default class TypeOfWorkController {
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

      const lastPage = (record.abilityToWork || []).includes(AbilityToWorkValue.DEPENDENCY_ISSUES)
        ? addressLookup.createProfile.manageDrugsAndAlcohol(id, mode)
        : addressLookup.createProfile.abilityToWork(id, mode)

      const data = {
        backLocation: mode === 'new' ? lastPage : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        typeOfWork: record.typeOfWork || [],
        typeOfWorkDetails: record.typeOfWorkDetails,
      }

      // Store page data for use if validation fails
      req.session.data[`typeOfWork_${id}_data`] = data

      res.render('pages/createProfile/typeOfWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { typeOfWork = [], typeOfWorkDetails } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`typeOfWork_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/typeOfWork/index', {
          ...data,
          errors,
          typeOfWork,
          typeOfWorkDetails,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        typeOfWork,
        typeOfWorkDetails: typeOfWork.includes(TypeOfWorkValue.OTHER) ? typeOfWorkDetails : '',
      }
      delete req.session.data[`typeOfWork_${id}_data`]

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.jobOfParticularInterest(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
