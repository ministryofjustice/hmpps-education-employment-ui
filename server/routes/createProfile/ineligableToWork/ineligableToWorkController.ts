import { RequestHandler } from 'express'
import ProfileStatus from '../../../enums/profileStatus'

import YesNoValue from '../../../enums/yesNoValue'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import addressLookup from '../../addressLookup'

export default class IneligableToWorkController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to rightToWork
      const record = req.session.data[`createProfile_${id}`]
      if (!record || record.rightToWork !== YesNoValue.NO) {
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
      // API call to create profile
      await this.prisonerProfileService.createProfile(res.locals.user.token, {
        prisonerId: id,
        bookingId: prisoner.bookingId,
        status: ProfileStatus.NO_RIGHT_TO_WORK,
        currentUser: res.locals.user.username,
      })

      // Tidy up record in session
      delete req.session.data[`createProfile_${id}`]

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
