import type { RequestHandler } from 'express'
import UserService from '../../services/userService'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets prisoner based on id parameter and puts it into request context
const getUserRolesResolver =
  (userService: UserService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user

    try {
      // Check session for cached roles
      if (getSessionData(req, ['userRoles', username])) {
        req.context.userRoles = getSessionData(req, ['userRoles', username])
        next()
        return
      }

      // Get roles
      req.context.userRoles = await userService.getDpsUserRoles(username)
      setSessionData(req, ['userRoles', username], req.context.userRoles)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getUserRolesResolver
