import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import getBackLocation from '../../../../utils/getBackLocation'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import identificationValue from '../../../../enums/identificationValue'

export default class IdentificationController {
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
        defaultRoute: addressLookup.workReadiness.createProfile.alreadyInPlace(id, mode),
        page: 'identification',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        identification: record.identification || [],
        typeOfIdentificationDetails: record.typeOfIdentificationDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['identification', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/identification/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { identification = [], typeOfIdentificationDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['identification', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/identification/index', {
          ...data,
          errors,
          identification,
          typeOfIdentificationDetails,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        identification,
        typeOfIdentificationDetails: identification.includes(identificationValue.OTHER)
          ? typeOfIdentificationDetails
          : '',
      })
      deleteSessionData(req, ['identification', id, 'data'])

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
