import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import AlreadyInPlaceValue from '../../../../enums/alreadyInPlaceValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import getBackLocation from '../../../../utils/getBackLocation'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../../utils/pageTitleLookup'

export default class AlreadyInPlaceController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (!record) {
        res.redirect(addressLookup.workReadiness.createProfile.rightToWork(id, mode))
        return
      }

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new'
            ? addressLookup.workReadiness.createProfile.supportOptIn(id, mode)
            : addressLookup.workReadiness.createProfile.checkAnswers(id),
        page: 'alreadyInPlace',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        alreadyInPlace: record.alreadyInPlace || [],
      }

      // Store page data for use if validation fails
      setSessionData(req, ['alreadyInPlace', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/alreadyInPlace/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { alreadyInPlace = [] } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['alreadyInPlace', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/alreadyInPlace/index', {
          ...data,
          errors,
          alreadyInPlace,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        alreadyInPlace,
      })
      deleteSessionData(req, ['alreadyInPlace', id, 'data'])

      if (alreadyInPlace.includes(AlreadyInPlaceValue.ID)) {
        res.redirect(addressLookup.workReadiness.createProfile.identification(id, mode))
        return
      }

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.workReadiness.createProfile.abilityToWork(id, mode)
          : addressLookup.workReadiness.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
