import { RequestHandler, response } from 'express'

import YesNoValue from '../../../enums/yesNoValue'
import addressLookup from '../../addressLookup'

export default class IneligableToWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to rightToWork
      const record = req.session.data[`createProfile_${id}`]
      if (!record || record.rightToWork !== YesNoValue.No) {
        response.redirect(addressLookup.createProfile.rightToWork(id, mode))
        return
      }

      const data = {
        backLocation: addressLookup.createProfile.rightToWork(id, mode),
        prisoner,
      }

      res.render('pages/createProfile/ineligableToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { rightToWork } = req.body

    try {
      // Todo: API call to set rightToWork

      // Tidy up record in session
      delete req.session.data[`createProfile_${id}`]

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
