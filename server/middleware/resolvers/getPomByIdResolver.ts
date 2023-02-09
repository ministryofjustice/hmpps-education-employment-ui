import type { RequestHandler } from 'express'

import AllocationManagerService from '../../services/allocationManagerService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets Pom based on id parameter and puts it into request context
const getPomByIdResolver =
  (allocationManagerService: AllocationManagerService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params

    try {
      // Check session for cached Pom
      if (getSessionData(req, ['pom', id])) {
        req.context.Pom = getSessionData(req, ['pom', id])
        next()
        return
      }

      // Get Pom
      req.context.pom = await allocationManagerService.getPomForOffender(id)
      setSessionData(req, ['pom', id], req.context.pom)

      next()
    } catch (err) {
      next()
    }
  }

export default getPomByIdResolver
