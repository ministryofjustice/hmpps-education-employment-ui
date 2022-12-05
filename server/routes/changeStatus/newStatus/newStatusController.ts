import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'

export default class NewStatusController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner, profile } = req.context

    try {
      if (!profile) {
        res.redirect(addressLookup.workProfile(id))
        return
      }

      // Get record in sessionData
      const record = getSessionData(req, ['changeStatus', id], {})

      const data = {
        backLocation: addressLookup.workProfile(id),
        prisoner,
        newStatus: record.newStatus,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['newStatus', id, 'data'], data)

      res.render('pages/changeStatus/newStatus/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { newStatus } = req.body
    // const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['newStatus', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/changeStatus/newStatus/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      setSessionData(req, ['changeStatus', id], {
        newStatus,
      })
      deleteSessionData(req, ['newStatus', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.changeStatus.newStatusPause(id))
    } catch (err) {
      next(err)
    }
  }
}
