import { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import ProfileStatus from '../../../../enums/profileStatus'

import YesNoValue from '../../../../enums/yesNoValue'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import addressLookup from '../../../addressLookup'
import { deleteSessionData, getSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../../utils/pageTitleLookup'

export default class IneligableToWorkController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (!record || record.rightToWork !== YesNoValue.NO) {
        res.redirect(addressLookup.workReadiness.createProfile.rightToWork(id, mode))
        return
      }

      // Setup back location
      const backLocation = addressLookup.workReadiness.createProfile.rightToWork(id, mode)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
      }

      res.render('pages/workReadiness/createProfile/ineligableToWork/index', { ...data })
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
      deleteSessionData(req, ['createProfile', id])

      res.redirect(addressLookup.workReadiness.cohortList())
    } catch (err) {
      next(err)
    }
  }
}
