import _ from 'lodash'
import type { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'
import { getSessionData } from '../../utils/session'

// Gets current Offender Activities based on id parameter and puts it into request context
const getCurrentOffenderActivitiesResolver =
  (prisonService: PrisonService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached currentOffenderActivities
      if (getSessionData(req, ['currentOffenderActivities', id])) {
        req.context.currentOffenderActivities = getSessionData(req, ['currentOffenderActivities', id])
        next()
        return
      }

      const activitiesResult = await prisonService.getAllOffenderActivities(username, id)
      req.context.currentOffenderActivities = _.get(activitiesResult, 'content', []).filter(
        (a: { isCurrentActivity: boolean }) => a.isCurrentActivity === true,
      )

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCurrentOffenderActivitiesResolver
