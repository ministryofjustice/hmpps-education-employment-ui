import { RequestHandler } from 'express'

import PrisonerProfileService from '../../../services/prisonerProfileService'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData } from '../../../utils/session'

export default class NewStatusPauseController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // If no record or incorrect value return to rightToWork
      const record = getSessionData(req, ['changeStatus', id])
      if (!record || !record?.newStatus) {
        res.redirect(addressLookup.changeStatus.newStatus(id))
        return
      }

      const data = {
        backLocation: addressLookup.changeStatus.newStatus(id),
        prisoner,
      }

      res.render('pages/changeStatus/newStatusPause/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    deleteSessionData(req, ['newStatusPause', id, 'data'])
    res.redirect(`${addressLookup.createProfile.alreadyInPlace(id)}?from=${req.originalUrl}`)
  }
}
