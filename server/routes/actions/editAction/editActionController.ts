import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class EditActionController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, action } = req.params
    const { noteAction = 'view' } = req.query
    const { prisoner, profile } = req.context

    try {
      if (!profile) {
        res.redirect(addressLookup.workProfile(id))
        return
      }

      // const profile = {
      //   profileData: {
      //     status: ProfileStatus.NO_RIGHT_TO_WORK,
      //     supportAccepted: {
      //       actionsRequired: {
      //         actions: [
      //           {
      //             todoItem: 'CV_AND_COVERING_LETTER',
      //             status: 'IN_PROGRESS',
      //             notes: [
      //               {
      //                 createdDate: '23 Oct 2022',
      //                 createdTime: '10:34',
      //                 createdName: 'Joe Bloggs',
      //                 details: 'Some note details',
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //     },
      //   },
      // }

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
        notes: item.notes,
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

        // Call api to add note
      }

      res.redirect(addressLookup.actions.editAction(id, action))
    } catch (err) {
      next(err)
    }
  }
}
