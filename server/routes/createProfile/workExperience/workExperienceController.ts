/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/yesNoValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import UpdateProfileRequest from '../../../data/models/updateProfileRequest'
import workProfileTabs from '../../../enums/workProfileTabs'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class WorkExperienceController {
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

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute:
          mode === 'new'
            ? addressLookup.createProfile.jobOfParticularInterest(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        page: 'workExperience',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        workExperience:
          mode === 'update'
            ? profile.profileData.supportAccepted.workExperience.previousWorkOrVolunteering
              ? YesNoValue.YES
              : YesNoValue.NO
            : record.workExperience,
        workExperienceDetails:
          mode === 'update'
            ? profile.profileData.supportAccepted.workExperience.previousWorkOrVolunteering
            : record.workExperienceDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['workExperience', id, 'data'], data)

      res.render('pages/createProfile/workExperience/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { workExperience, workExperienceDetails } = req.body
    const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['workExperience', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/workExperience/index', {
          ...data,
          errors,
          workExperience,
          workExperienceDetails,
        })
        return
      }

      deleteSessionData(req, ['workExperience', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportAccepted.workExperience = {
          ...profile.profileData.supportAccepted.workExperience,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          previousWorkOrVolunteering: workExperience === YesNoValue.YES ? workExperienceDetails : '',
        }

        // Call api, change status
        await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

        res.redirect(addressLookup.workProfile(id, workProfileTabs.EXPERIENCE))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        workExperience,
        workExperienceDetails: workExperience === YesNoValue.YES ? workExperienceDetails : '',
      })

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.trainingAndQualifications(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
