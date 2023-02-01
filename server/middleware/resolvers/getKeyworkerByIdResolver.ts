import type { RequestHandler } from 'express'

import KeyworkerService from '../../services/keyworkerService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets keyworker based on id parameter and puts it into request context
const getKeyworkerByIdResolver =
  (keyworkerService: KeyworkerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      // Check session for cached keyworker
      if (getSessionData(req, ['keyworker', id])) {
        req.context.keyworker = getSessionData(req, ['keyworker', id])
        next()
        return
      }

      // Get keyworker
      req.context.keyworker = await keyworkerService.getKeyworkerForOffender(user.token, id)
      setSessionData(req, ['keyworker', id], req.context.keyworker)

      next()
    } catch (err) {
      // Swallow not found errors
      if (err?.data?.status === 404) {
        next()
        return
      }

      next(err)
    }
  }

export default getKeyworkerByIdResolver
