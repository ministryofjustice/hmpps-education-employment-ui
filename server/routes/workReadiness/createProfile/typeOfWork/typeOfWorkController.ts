import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import TypeOfWorkValue from '../../../../enums/typeOfWorkValue'
import AbilityToWorkValue from '../../../../enums/abilityToWorkValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../../utils/getBackLocation'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import UpdateProfileRequest from '../../../../data/models/updateProfileRequest'
import workProfileTabs from '../../../../enums/workProfileTabs'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import isWithin12Weeks from '../../../../utils/isWithin12Weeks'

export default class TypeOfWorkController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, profile } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (mode !== 'update' && !record) {
        res.redirect(addressLookup.workReadiness.createProfile.rightToWork(id, mode))
        return
      }

      const lastPage =
        mode !== 'update' && (record.abilityToWork || []).includes(AbilityToWorkValue.DEPENDENCY_ISSUES)
          ? addressLookup.workReadiness.createProfile.manageDrugsAndAlcohol(id, mode)
          : addressLookup.workReadiness.createProfile.abilityToWork(id, mode)

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: mode === 'new' ? lastPage : addressLookup.workReadiness.createProfile.checkAnswers(id),
        page: 'typeOfWork',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
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

      res.render('pages/workReadiness/createProfile/typeOfWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { typeOfWork = [], typeOfWorkDetails } = req.body
    const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['typeOfWork', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/typeOfWork/index', {
          ...data,
          errors,
          typeOfWork,
          typeOfWorkDetails,
        })
        return
      }

      deleteSessionData(req, ['typeOfWork', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportAccepted.workInterests = {
          ...profile.profileData.supportAccepted.workInterests,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          workTypesOfInterest: typeOfWork,
          workTypesOfInterestOther: typeOfWork.includes(TypeOfWorkValue.OTHER) ? typeOfWorkDetails : '',
        }

        // Indicate whether releaseDate is within 12 weeks or not
        profile.profileData.within12Weeks = isWithin12Weeks(profile.profileData.nonDtoReleaseDate)

        // Call api, change status
        await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

        // Return to current profile
        const module = getSessionData(req, ['workProfile', id, 'currentModule'], 'wr')
        res.redirect(addressLookup.workProfile(id, workProfileTabs.EXPERIENCE, module))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        typeOfWork,
        typeOfWorkDetails: typeOfWork.includes(TypeOfWorkValue.OTHER) ? typeOfWorkDetails : '',
      })

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.workReadiness.createProfile.jobOfParticularInterest(id, mode)
          : addressLookup.workReadiness.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
