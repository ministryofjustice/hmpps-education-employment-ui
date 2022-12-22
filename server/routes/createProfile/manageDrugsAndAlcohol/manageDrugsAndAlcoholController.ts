/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import getBackLocation from '../../../utils/getBackLocation'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import ManageDrugsAndAlcoholValue from '../../../enums/manageDrugsAndAlcoholValue'

export default class ManageDrugsAndAlcoholController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, profile } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (mode !== 'update' && !record) {
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation: getBackLocation({
          req,
          defaultRoute: addressLookup.createProfile.abilityToWork(id, mode),
          page: 'manageDrugsAndAlcohol',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        manageDrugsAndAlcohol:
          mode === 'update'
            ? profile.profileData.supportAccepted.workInterests.jobOfParticularInterest
              ? ManageDrugsAndAlcoholValue.ABLE_TO_MANAGE
              : ManageDrugsAndAlcoholValue.NOT_ABLE_TO_MANAGE
            : record.manageDrugsAndAlcohol,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['manageDrugsAndAlcohol', id, 'data'], data)

      res.render('pages/createProfile/manageDrugsAndAlcohol/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { manageDrugsAndAlcohol } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['manageDrugsAndAlcohol', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/manageDrugsAndAlcohol/index', {
          ...data,
          errors,
        })
        return
      }

      // Handle update
      if (mode === 'update') {
        res.redirect(addressLookup.workProfile(id))
        return
      }

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        manageDrugsAndAlcohol,
      })
      deleteSessionData(req, ['manageDrugsAndAlcohol', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.typeOfWork(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
