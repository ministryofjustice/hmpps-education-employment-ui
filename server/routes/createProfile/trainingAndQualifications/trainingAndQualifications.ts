import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import TrainingAndQualificationsValue from '../../../enums/trainingAndQualificationsValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class TrainingAndQualificationsController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation:
          mode === 'new'
            ? addressLookup.createProfile.workExperience(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        trainingAndQualifications: record.trainingAndQualifications || [],
        trainingAndQualificationsDetails: record.trainingAndQualificationsDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['trainingAndQualifications', id, 'data'], data)

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

      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        trainingAndQualifications,
        trainingAndQualificationsDetails: trainingAndQualifications.includes(TrainingAndQualificationsValue.OTHER)
          ? trainingAndQualificationsDetails
          : '',
      })
      deleteSessionData(req, ['trainingAndQualifications', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(addressLookup.createProfile.checkAnswers(id))
    } catch (err) {
      next(err)
    }
  }
}
