import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import UpdateProfileRequest from '../../../data/models/updateProfileRequest'
import NotesViewModel from '../../../viewModels/notesViewModel'

export default class EditActionController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, action } = req.params
    const { noteAction = 'view' } = req.query
    const { prisoner, profile, notes } = req.context

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
        id,
        backLocation: addressLookup.workProfile(id),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        toDoItem: item.todoItem,
        toDoStatus: item.status,
        noteAction,
        notes: plainToClass(NotesViewModel, notes),
      }

      // Store page data for use if validation fails
      setSessionData(req, ['editAction', id, 'data'], data)

      res.render('pages/actions/editAction/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, action } = req.params
    const { noteAction = 'view' } = req.query
    const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['editAction', id, 'data'])

      if (noteAction === 'add') {
        const errors = validateFormSchema(req, validationSchema())

        if (errors) {
          res.render('pages/actions/editAction/index', {
            ...data,
            ...req.body,
            errors,
          })
          return
        }

        // Create note
        await this.prisonerProfileService.createNote(res.locals.user.token, id, action.toUpperCase(), req.body.noteText)
        res.redirect(addressLookup.actions.editAction(id, action))
        return
      }

      // Update data model
      const actions = profile.profileData.supportAccepted.actionsRequired.actions || []
      // Change status of action
      profile.profileData.supportAccepted.actionsRequired.actions = [
        ...actions.filter((a: { todoItem: string }) => a.todoItem !== action.toUpperCase()),
        {
          ...actions.find((a: { todoItem: string }) => a.todoItem === action.toUpperCase()),
          status: req.body.toDoStatus,
        },
      ]

      // Update modified by
      profile.profileData.supportAccepted.actionsRequired = {
        ...profile.profileData.supportAccepted.actionsRequired,
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      }

      // Call api, change status
      await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
