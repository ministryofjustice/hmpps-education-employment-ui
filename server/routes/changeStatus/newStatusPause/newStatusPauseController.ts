import { RequestHandler } from 'express'

import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import YesNoValue from '../../../enums/yesNoValue'

export default class NewStatusPauseController {
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

    setSessionData(req, ['createProfile', id], {
      rightToWork: YesNoValue.YES,
    })

    res.redirect(`${addressLookup.createProfile.alreadyInPlace(id)}?from=${req.originalUrl}`)
  }
}
