import type { RequestHandler } from 'express'

import KeyworkerService from '../../services/keyworkerService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets prisoner based on id parameter and puts it into request context
const getKeyworkerByIdResolver =
  (keyworkerService: KeyworkerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      // Check session for cached prisoner
      if (getSessionData(req, ['keyworker', id])) {
        req.context.keyworker = getSessionData(req, ['keyworker', id])
        next()
        return
      }

      // Get prisoner
      req.context.keyworker = await keyworkerService.getKeyworkerForOffender(user.token, id)
      setSessionData(req, ['keyworker', id], req.context.keyworker)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getKeyworkerByIdResolver
