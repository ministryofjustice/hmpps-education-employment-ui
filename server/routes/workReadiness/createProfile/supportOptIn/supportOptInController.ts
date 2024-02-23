import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import YesNoValue from '../../../../enums/yesNoValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../../utils/pageTitleLookup'

export default class SupportOptInController {
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

      // Setup back location
      const backLocation =
        mode === 'new'
          ? addressLookup.createProfile.rightToWork(id, mode)
          : addressLookup.createProfile.checkAnswers(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        supportOptIn: record.supportOptIn,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['supportOptIn', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/supportOptIn/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { supportOptIn } = req.body
    let { mode } = req.params

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['supportOptIn', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/supportOptIn/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      if (record.supportOptIn && record.supportOptIn !== supportOptIn) {
        setSessionData(req, ['createProfile', id], {
          rightToWork: YesNoValue.YES,
          supportOptIn,
        })
        mode = 'new'
      } else {
        setSessionData(req, ['createProfile', id], {
          ...record,
          supportOptIn,
        })
      }
      deleteSessionData(req, ['supportOptIn', id, 'data'])

      // If NO redirect to ineligable-to-work
      if (supportOptIn === YesNoValue.NO) {
        res.redirect(addressLookup.createProfile.supportDeclinedReason(id, mode))
        return
      }

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.alreadyInPlace(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
