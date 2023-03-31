import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TrainingAndQualificationsValue from '../../../enums/trainingAndQualificationsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../utils/getBackLocation'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import UpdateProfileRequest from '../../../data/models/updateProfileRequest'
import workProfileTabs from '../../../enums/workProfileTabs'
import pageTitleLookup from '../../../utils/pageTitleLookup'

export default class TrainingAndQualificationsController {
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
            ? addressLookup.createProfile.workExperience(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        page: 'trainingAndQualifications',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        trainingAndQualifications:
          mode === 'update'
            ? profile.profileData.supportAccepted.workExperience.qualificationsAndTraining
            : record.trainingAndQualifications || [],
        trainingAndQualificationsDetails:
          mode === 'update'
            ? profile.profileData.supportAccepted.workExperience.qualificationsAndTrainingOther
            : record.trainingAndQualificationsDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['trainingAndQualifications', id, 'data'], data)

      res.render('pages/createProfile/trainingAndQualifications/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { mode, id } = req.params
    const { trainingAndQualifications = [], trainingAndQualificationsDetails } = req.body
    const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['trainingAndQualifications', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/trainingAndQualifications/index', {
          ...data,
          errors,
          trainingAndQualifications,
          trainingAndQualificationsDetails,
        })
        return
      }

      deleteSessionData(req, ['trainingAndQualifications', id, 'data'])

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportAccepted.workExperience = {
          ...profile.profileData.supportAccepted.workExperience,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          qualificationsAndTraining: trainingAndQualifications,
          qualificationsAndTrainingOther: trainingAndQualifications.includes(TrainingAndQualificationsValue.OTHER)
            ? trainingAndQualificationsDetails
            : '',
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
        trainingAndQualifications,
        trainingAndQualificationsDetails: trainingAndQualifications.includes(TrainingAndQualificationsValue.OTHER)
          ? trainingAndQualificationsDetails
          : '',
      })

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.createProfile.checkAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
