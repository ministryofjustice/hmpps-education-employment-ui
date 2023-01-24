import type { RequestHandler } from 'express'

import CuriousEsweService from '../../services/curiousEsweService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets prisoner neurodivergence data held in CuriousApi, based on id parameter and puts it into request context
const getNeurodivergenceResolver =
  (curiousEsweService: CuriousEsweService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { nomisId } = req.params

    try {
      // Check session for cached neurodivergence data for this prisoner
      if (getSessionData(req, ['neurodivergence', nomisId])) {
        req.context.neurodivergence = getSessionData(req, ['neurodivergence', nomisId])
        next()
        return
      }

      // Get neurodivergence data
      req.context.neurodivergence = await curiousEsweService.getLearnerNeurodivergence(nomisId)
      setSessionData(req, ['neurodivergence', nomisId], req.context.neurodivergence)

      next()
    } catch (err) {
      // Handle no neurodivergence data
      if (
        err?.data?.status === 404 &&
        err?.data?.userMessage.indexOf('There is no neurodivergence data for this prisoner') > -1
      ) {
        next()
        return
      }
      next(err)
    }
  }

export default getNeurodivergenceResolver
