import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/yesNoValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'

export default class RightToWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createProfile', id], {})

      const data = {
        backLocation: mode === 'new' ? addressLookup.workProfile(id) : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        rightToWork: record.rightToWork,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['rightToWork', id, 'data'], data)

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
      const data = getSessionData(req, ['rightToWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/rightToWork/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id], {})
      setSessionData(req, ['createProfile', id], {
        ...record,
        rightToWork,
      })
      deleteSessionData(req, ['rightToWork', id, 'data'])

      // If NO redirect to ineligable-to-work
      if (rightToWork === YesNoValue.NO) {
        res.redirect(addressLookup.createProfile.ineligableToWork(id, mode))
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
