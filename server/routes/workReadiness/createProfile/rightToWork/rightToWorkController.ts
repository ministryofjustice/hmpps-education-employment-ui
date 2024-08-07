import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import YesNoValue from '../../../../enums/yesNoValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../../utils/pageTitleLookup'

export default class RightToWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // Get record in sessionData
      const record = getSessionData(req, ['createProfile', id], {})

      // Setup back location
      const backLocation =
        mode === 'new'
          ? addressLookup.workProfile(id, 'overview')
          : addressLookup.workReadiness.createProfile.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        rightToWork: record.rightToWork,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['rightToWork', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/rightToWork/index', { ...data })
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
        res.render('pages/workReadiness/createProfile/rightToWork/index', {
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
        res.redirect(addressLookup.workReadiness.createProfile.ineligableToWork(id, mode))
        return
      }

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.workReadiness.createProfile.supportOptIn(id, mode)
          : addressLookup.workReadiness.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
