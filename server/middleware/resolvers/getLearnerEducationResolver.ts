import type { RequestHandler } from 'express'

import CuriousEsweService from '../../services/curiousEsweService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets learner employability skills data held in CuriousApi, based on id parameter and puts it into request context
const getLearnerEducationResolver =
  (curiousEsweService: CuriousEsweService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { nomisId } = req.params

    try {
      // Check session for cached employability skills data for this prisoner
      if (getSessionData(req, ['learnerEducation', nomisId])) {
        req.context.learnerEducation = getSessionData(req, ['learnerEducation', nomisId])
        next()
        return
      }

      // Get employability skills data
      req.context.learnerEducation = await curiousEsweService.getLearnerEducation(nomisId)
      setSessionData(req, ['learnerEducation', nomisId], req.context.learnerEducation)

      next()
    } catch (err) {
      // Handle no employability skills data
      if (
        err?.data?.status === 404 &&
        err?.data?.userMessage.indexOf('There is no education data for this prisoner') > -1
      ) {
        next()
        return
      }
      next(err)
    }
  }

export default getLearnerEducationResolver
