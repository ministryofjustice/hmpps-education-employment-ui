import type { RequestHandler } from 'express'

import DeliusIntegrationService from '../../services/deliusIntegrationService'
import { getSessionData, setSessionData } from '../../utils/session'
import getComById from './utils/getComById'

// Gets Com based on id parameter and puts it into request context
const getComByIdResolver =
  (deliusIntegrationService: DeliusIntegrationService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached Com
      if (getSessionData(req, ['com', id])) {
        req.context.com = getSessionData(req, ['com', id])
        next()
        return
      }

      // Get Com
      req.context.com = await getComById(deliusIntegrationService, username, id)
      setSessionData(req, ['com', id], req.context.com)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getComByIdResolver
