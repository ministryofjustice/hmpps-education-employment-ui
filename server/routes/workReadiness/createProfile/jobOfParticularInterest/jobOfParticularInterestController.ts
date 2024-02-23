/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import YesNoValue from '../../../../enums/yesNoValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import getBackLocation from '../../../../utils/getBackLocation'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import UpdateProfileRequest from '../../../../data/models/updateProfileRequest'
import workProfileTabs from '../../../../enums/workProfileTabs'
import pageTitleLookup from '../../../../utils/pageTitleLookup'

export default class JobOfParticularInterestController {
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
            ? addressLookup.createProfile.typeOfWork(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        page: 'jobOfParticularInterest',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        jobOfParticularInterest:
          mode === 'update'
            ? profile.profileData.supportAccepted.workInterests.jobOfParticularInterest
              ? YesNoValue.YES
              : YesNoValue.NO
            : record.jobOfParticularInterest,
        jobOfParticularInterestDetails:
          mode === 'update'
            ? profile.profileData.supportAccepted.workInterests.jobOfParticularInterest
            : record.jobOfParticularInterestDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['jobOfParticularInterest', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/jobOfParticularInterest/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { jobOfParticularInterest, jobOfParticularInterestDetails } = req.body
    const { profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobOfParticularInterest', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/jobOfParticularInterest/index', {
          ...data,
          errors,
          jobOfParticularInterest,
          jobOfParticularInterestDetails,
        })
        return
      }

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportAccepted.workInterests = {
          ...profile.profileData.supportAccepted.workInterests,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          jobOfParticularInterest: jobOfParticularInterest === YesNoValue.YES ? jobOfParticularInterestDetails : '',
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
        jobOfParticularInterest,
        jobOfParticularInterestDetails:
          jobOfParticularInterest === YesNoValue.YES ? jobOfParticularInterestDetails : '',
      })
      deleteSessionData(req, ['jobOfParticularInterest', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.createProfile.workExperience(id, mode)
          : addressLookup.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
