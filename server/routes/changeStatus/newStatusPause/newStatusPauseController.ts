import { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import YesNoValue from '../../../enums/yesNoValue'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../utils/pageTitleLookup'

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

      // Setup back location
      const backLocation = addressLookup.changeStatus.newStatus(id)
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        id,
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        newStatus: record.newStatus,
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
      supportOptIn: YesNoValue.YES,
    })

    res.redirect(`${addressLookup.createProfile.alreadyInPlace(id)}?from=${req.originalUrl}`)
  }
}
