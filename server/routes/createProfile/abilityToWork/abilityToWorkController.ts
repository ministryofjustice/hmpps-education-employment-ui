import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'

export default class AbilityToWorkController {
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

      // Calculate last page based on record in session
      const lastPage = (record.alreadyInPlace || []).includes(AlreadyInPlaceValue.ID)
        ? addressLookup.createProfile.identification(id, mode)
        : addressLookup.createProfile.alreadyInPlace(id, mode)

      const data = {
        backLocation: mode === 'new' ? lastPage : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        abilityToWork: record.abilityToWork || [],
      }

      // Store page data for use if validation fails
      setSessionData(req, ['abilityToWork', id, 'data'], data)

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
      const data = getSessionData(req, ['abilityToWork', id, 'data'])
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
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        abilityToWork,
      })
      deleteSessionData(req, ['abilityToWork', id, 'data'])

      if (abilityToWork.includes(AbilityToWorkValue.DEPENDENCY_ISSUES)) {
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
