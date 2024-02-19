import type { RequestHandler } from 'express'
import CandidateMatchingService from '../../services/candidateMatchingService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets prisoner based on id parameter and puts it into request context
const getCandidateMatchingResolver =
  (candidateMatchingService: CandidateMatchingService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user

    try {
      // Check session for cached roles
      if (getSessionData(req, ['userroles', username])) {
        req.context.userroles = getSessionData(req, ['userroles', username])
        next()
        return
      }

      // Get roles
      req.context.userroles = await candidateMatchingService.getDpsUserRoles(username)
      setSessionData(req, ['userroles', username], req.context.userroles)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getCandidateMatchingResolver
