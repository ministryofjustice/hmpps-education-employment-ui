import { Request, Response, NextFunction } from 'express'
import jwtDecode from 'jwt-decode'

// Gets prisoner based on id parameter and puts it into request context
const getUserRolesResolver = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get roles
    const user = jwtDecode(res.locals.user.token) as { authorities?: string[] }
    req.context.userRoles = user.authorities

    next()
  } catch (err) {
    next(err)
  }
}

export default getUserRolesResolver
