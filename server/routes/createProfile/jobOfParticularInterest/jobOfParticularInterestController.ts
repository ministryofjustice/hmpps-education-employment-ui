import type { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/yesNoValue'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class JobOfParticularInterestController {
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
            ? addressLookup.createProfile.typeOfWork(id, mode)
            : addressLookup.createProfile.checkAnswers(id),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        jobOfParticularInterest: record.jobOfParticularInterest,
        jobOfParticularInterestDetails: record.jobOfParticularInterestDetails,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['jobOfParticularInterest', id, 'data'], data)

      res.render('pages/createProfile/jobOfParticularInterest/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { jobOfParticularInterest, jobOfParticularInterestDetails } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['jobOfParticularInterest', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/jobOfParticularInterest/index', {
          ...data,
          errors,
          jobOfParticularInterest,
          jobOfParticularInterestDetails,
        })
        return
      }

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
