import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import getBackLocation from '../../../utils/getBackLocation'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class IdentificationController {
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

      const data = {
        backLocation: getBackLocation({
          req,
          defaultRoute: addressLookup.createProfile.alreadyInPlace(id, mode),
          page: 'identification',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        identification: record.identification || [],
      }

      // Store page data for use if validation fails
      setSessionData(req, ['identification', id, 'data'], data)

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
      const data = getSessionData(req, ['identification', id, 'data'])
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
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        identification,
      })
      deleteSessionData(req, ['identification', id, 'data'])

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
