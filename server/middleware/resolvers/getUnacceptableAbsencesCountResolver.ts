import type { RequestHandler } from 'express'
import WhereaboutsService from '../../services/whereaboutsService'
import { getSessionData } from '../../utils/session'

// Gets unacceptable Absences Count based on id parameter and puts it into request context
const getUnacceptableAbsencesCountResolver =
  (whereaboutsService: WhereaboutsService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      // Check session for cached unacceptableAbsencesCount
      if (getSessionData(req, ['unacceptableAbsencesCount', id])) {
        req.context.unacceptableAbsencesCount = getSessionData(req, ['unacceptableAbsencesCount', id])
        next()
        return
      }

      const fromDate = new Date()
      fromDate.setMonth(fromDate.getMonth() - 6)
      const toDate = new Date()

      const results = await whereaboutsService.getUnacceptibleAbsenceCount(user.token, id, fromDate, toDate)
      req.context.unacceptableAbsencesCount = results

      next()
    } catch (err) {
      next(err)
    }
  }

export default getUnacceptableAbsencesCountResolver
