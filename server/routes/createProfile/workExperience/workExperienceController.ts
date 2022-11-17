import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/yesNoValue'

export default class WorkExperienceController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = req.session.data[`createProfile_${id}`]
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation:
          mode === 'new'
            ? addressLookup.createProfile.jobOfParticularInterest(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        workExperience: record.workExperience,
        workExperienceDetails: record.workExperienceDetails,
      }

      // Store page data for use if validation fails
      req.session.data[`workExperience_${id}_data`] = data

      res.render('pages/createProfile/workExperience/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { workExperience, workExperienceDetails } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`workExperience_${id}_data`]
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

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        workExperience,
        workExperienceDetails: workExperience === YesNoValue.YES ? workExperienceDetails : '',
      }
      delete req.session.data[`workExperience_${id}_data`]

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
