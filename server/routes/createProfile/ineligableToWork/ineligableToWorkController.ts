import { RequestHandler } from 'express'
import { ProfileStatus } from '../../../data/prisonerSearch/createProfileRequest'
import PrisonerProfileClient from '../../../data/prisonerSearch/prisonerProfileClient'

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
        res.redirect(addressLookup.createProfile.rightToWork(id, mode))
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
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // Todo: API call to set rightToWork
      const result = await new PrisonerProfileClient(res.locals.user.userToken).createProfile(
        res.locals.user.userName,
        {
          prisonerId: id,
          bookingId: prisoner.bookingId,
          status: ProfileStatus.NO_RIGHT_TO_WORK,
        },
      )

      // Tidy up record in session
      delete req.session.data[`createProfile_${id}`]

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
