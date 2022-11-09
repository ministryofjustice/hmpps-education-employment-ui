import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TrainingAndQualificationsValue from '../../../enums/trainingAndQualificationsValue'

export default class TrainingAndQualificationsController {
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
            ? addressLookup.createProfile.workExperience(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner,
        trainingAndQualifications: record.trainingAndQualifications || [],
        trainingAndQualificationsDetails: record.trainingAndQualificationsDetails,
      }

      // Store page data for use if validation fails
      req.session.data[`trainingAndQualifications_${id}_data`] = data

      res.render('pages/createProfile/trainingAndQualifications/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { trainingAndQualifications = [], trainingAndQualificationsDetails } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`trainingAndQualifications_${id}_data`]
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

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        trainingAndQualifications,
        trainingAndQualificationsDetails: trainingAndQualifications.includes(TrainingAndQualificationsValue.OTHER)
          ? trainingAndQualificationsDetails
          : '',
      }
      delete req.session.data[`trainingAndQualifications_${id}_data`]

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.createProfile.checkAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
