import { RequestHandler } from 'express'
import jwtDecode from 'jwt-decode'
import logger from '../../logger'
import UserService from '../services/userService'

export default function populateCurrentUser(userService: UserService): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const user = res.locals.user && (await userService.getUser(res.locals.user.token))
        const { user_uuid: userUuid } = jwtDecode(res.locals.user.token) as { user_uuid?: string }
        if (user) {
          res.locals.user = { ...user, ...res.locals.user, userUuid }
          res.locals.isPrisonUser = res.locals.user.authSource === 'nomis'
        } else {
          logger.info('No user available')
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  }
}
