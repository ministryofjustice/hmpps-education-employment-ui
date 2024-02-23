import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import UpdateProfileRequest from '../../../../data/models/updateProfileRequest'
import NotesViewModel from '../../../../viewModels/notesViewModel'
import AlreadyInPlaceValue from '../../../../enums/alreadyInPlaceValue'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import IdentificationValue from '../../../../enums/identificationValue'

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

      const cachedValues = getSessionData(req, ['editAction', id, 'cachedValues'], {})

      // Setup back location
      const backLocation = addressLookup.workProfile(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        id,
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        toDoItem: item.todoItem,
        other: item.other,
        toDoStatus: cachedValues.toDoStatus || item.status,
        identification: cachedValues.identification || item.id || [],
        noteAction,
        notes: plainToClass(NotesViewModel, notes),
      }

      // Store page data for use if validation fails
      setSessionData(req, ['editAction', id, 'data'], data)

      res.render('pages/workReadiness/actions/editAction/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, action } = req.params
    const { noteAction = 'view' } = req.query
    const { profile } = req.context

    try {
      const data = getSessionData(req, ['editAction', id, 'data'])

      // If addNote button clicked, redirect and show field
      if ('addNote' in req.body) {
        setSessionData(req, ['editAction', id, 'cachedValues'], {
          ...req.body,
        })

        res.redirect(`${addressLookup.actions.editAction(id, action)}?noteAction=add#noteText`)
        return
      }

      // If validation errors render errors
      if (noteAction === 'add') {
        const errors = validateFormSchema(req, validationSchema(true, data))

        if (errors) {
          res.render('pages/workReadiness/actions/editAction/index', {
            ...data,
            ...req.body,
            errors,
          })
          return
        }

        setSessionData(req, ['editAction', id, 'cachedValues'], {
          ...req.body,
        })

        // Create note
        await this.prisonerProfileService.createNote(res.locals.user.token, id, action.toUpperCase(), req.body.noteText)
        res.redirect(addressLookup.actions.editAction(id, action))
        return
      }

      const errors = validateFormSchema(req, validationSchema(false, data))

      if (errors) {
        res.render('pages/workReadiness/actions/editAction/index', {
          ...data,
          ...req.body,
          errors,
        })
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
          id: action.toUpperCase() === AlreadyInPlaceValue.ID ? req.body.identification : null,
          other:
            action.toUpperCase() === AlreadyInPlaceValue.ID &&
            (req.body.identification || []).includes(IdentificationValue.OTHER)
              ? req.body.other
              : null,
        },
      ]

      // Update modified by
      profile.profileData.supportAccepted.actionsRequired = {
        ...profile.profileData.supportAccepted.actionsRequired,
        modifiedBy: res.locals.user.username,
        modifiedDateTime: new Date().toISOString(),
      }

      deleteSessionData(req, ['editAction', id, 'cachedValues'])

      // Call api, change status
      await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
