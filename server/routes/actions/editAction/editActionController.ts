import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class NewStatusController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, action } = req.params
    const { prisoner, profile } = req.context

    try {
      if (!profile) {
        res.redirect(addressLookup.workProfile(id))
        return
      }

      const item = profile.profileData?.supportAccepted?.actionsRequired?.actions.find(
        (i: { todoItem: string }) => i.todoItem === action.toUpperCase(),
      )
      if (!item) {
        res.redirect(addressLookup.workProfile(id))
        return
      }

      const data = {
        backLocation: addressLookup.workProfile(id),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        toDoItem: item.todoItem,
        toDoStatus: item.status,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['editAction', id, 'data'], data)

      res.render('pages/actions/editAction/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['editAction', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/actions/editAction/index', {
          ...data,
          errors,
        })
        return
      }

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
