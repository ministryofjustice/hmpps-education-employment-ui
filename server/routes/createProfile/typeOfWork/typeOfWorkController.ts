import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TypeOfWorkValue from '../../../enums/typeOfWorkValue'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'

export default class TypeOfWorkController {
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

      const lastPage =
        mode !== 'update' && (record.abilityToWork || []).includes(AbilityToWorkValue.DEPENDENCY_ISSUES)
          ? addressLookup.createProfile.manageDrugsAndAlcohol(id, mode)
          : addressLookup.createProfile.abilityToWork(id, mode)

      const data = {
        backLocation: getBackLocation({
          req,
          defaultRoute: mode === 'new' ? lastPage : addressLookup.createProfile.checkAnswers(id),
          page: 'typeOfWork',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        typeOfWork:
          mode === 'update'
            ? profile.profileData.supportAccepted.workInterests.workTypesOfInterest
            : record.typeOfWork || [],
        typeOfWorkDetails:
          mode === 'update'
            ? profile.profileData.supportAccepted.workInterests.workTypesOfInterestOther
            : record.typeOfWorkDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['typeOfWork', id, 'data'], data)

      res.render('pages/createProfile/typeOfWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { typeOfWork = [], typeOfWorkDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['typeOfWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/typeOfWork/index', {
          ...data,
          errors,
          typeOfWork,
          typeOfWorkDetails,
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
        typeOfWork,
        typeOfWorkDetails: typeOfWork.includes(TypeOfWorkValue.OTHER) ? typeOfWorkDetails : '',
      })
      deleteSessionData(req, ['typeOfWork', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.jobOfParticularInterest(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
