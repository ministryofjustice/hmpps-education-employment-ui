import type { RequestHandler } from 'express'

import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/yesNoValue'

export default class JobOfParticularInterestController {
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
        backLocation: addressLookup.createProfile.typeOfWork(id, mode),
        prisoner,
        jobOfParticularInterest: record.jobOfParticularInterest,
        jobOfParticularInterestDetails: record.jobOfParticularInterestDetails,
      }

      // Store page data for use if validation fails
      req.session.data[`jobOfParticularInterest_${id}_data`] = data

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
      const data = req.session.data[`jobOfParticularInterest_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/jobOfParticularInterest/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData and tidy
      const record = req.session.data[`createProfile_${id}`]
      req.session.data[`createProfile_${id}`] = {
        ...record,
        jobOfParticularInterest,
        jobOfParticularInterestDetails:
          jobOfParticularInterest === YesNoValue.Yes ? jobOfParticularInterestDetails : '',
      }
      delete req.session.data[`jobOfParticularInterest_${id}_data`]

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
