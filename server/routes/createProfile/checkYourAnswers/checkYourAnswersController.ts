import { RequestHandler } from 'express'

import YesNoValue from '../../../enums/yesNoValue'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import addressLookup from '../../addressLookup'

export default class CheckYourAnswersController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to rightToWork
      const record = req.session.data[`createProfile_${id}`]
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id))
        return
      }

      const data = {
        id,
        record,
        prisoner,
      }

      res.render('pages/createProfile/checkYourAnswers/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    // const { prisoner } = req.context

    try {
      // API call to create profile

      // Tidy up record in session
      delete req.session.data[`createProfile_${id}`]

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
