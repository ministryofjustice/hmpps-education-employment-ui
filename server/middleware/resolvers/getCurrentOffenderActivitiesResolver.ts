import _ from 'lodash'
import type { RequestHandler } from 'express'
import PrisonService from '../../services/prisonService'

// Gets profile based on id parameter and puts it into request context
const getCurrentOffenderActivitiesResolver =
  (prisonService: PrisonService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      const activitiesResult = await prisonService.getAllOffenderActivities(user.token, id)
      req.context.currentOffenderActivities = _.get(activitiesResult, 'content', []).filter(
        (a: { isCurrentActivity: boolean }) => a.isCurrentActivity === true,
      )

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCurrentOffenderActivitiesResolver
