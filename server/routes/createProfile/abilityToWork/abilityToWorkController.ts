import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import UpdateProfileRequest from '../../../data/models/updateProfileRequest'
import workProfileTabs from '../../../enums/workProfileTabs'

export default class AbilityToWorkController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

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

      // Calculate last page based on record in session
      const lastPage =
        mode !== 'update' && (record.alreadyInPlace || []).includes(AlreadyInPlaceValue.ID)
          ? addressLookup.createProfile.identification(id, mode)
          : addressLookup.createProfile.alreadyInPlace(id, mode)

      const data = {
        backLocation: getBackLocation({
          req,
          defaultRoute: mode === 'new' ? lastPage : addressLookup.createProfile.checkAnswers(id),
          page: 'abilityToWork',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        abilityToWork:
          mode === 'update'
            ? profile.profileData.supportAccepted.workImpacts.abilityToWorkImpactedBy
            : record.abilityToWork || [],
      }

      // Store page data for use if validation fails
      setSessionData(req, ['abilityToWork', id, 'data'], data)

      res.render('pages/createProfile/abilityToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { abilityToWork = [] } = req.body
    const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['abilityToWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/abilityToWork/index', {
          ...data,
          errors,
          abilityToWork,
        })
        return
      }

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportAccepted.workImpacts = {
          ...profile.profileData.supportAccepted.workImpacts,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          abilityToWorkImpactedBy: abilityToWork,
          ableToManageDependencies: data.abilityToWork.includes(AbilityToWorkValue.DEPENDENCY_ISSUES)
            ? profile.profileData.supportAccepted.workImpacts.ableToManageDependencies
            : true,
        }

        // Call api, change status
        await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

        if (abilityToWork.includes(AbilityToWorkValue.DEPENDENCY_ISSUES)) {
          res.redirect(`${addressLookup.createProfile.manageDrugsAndAlcohol(id, mode)}?from=${req.originalUrl}`)
          return
        }

        res.redirect(addressLookup.workProfile(id, workProfileTabs.DETAILS))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        abilityToWork,
      })
      deleteSessionData(req, ['abilityToWork', id, 'data'])

      if (abilityToWork.includes(AbilityToWorkValue.DEPENDENCY_ISSUES)) {
        res.redirect(addressLookup.createProfile.manageDrugsAndAlcohol(id, mode))
        return
      }

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
