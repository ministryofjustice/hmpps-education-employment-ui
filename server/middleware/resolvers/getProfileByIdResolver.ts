import type { RequestHandler } from 'express'
import { UserService } from '../../services'

import PrisonerProfileService from '../../services/prisonerProfileService'

// Gets profile based on id parameter and puts it into request context
const getProfileByIdResolver =
  (prisonerProfileService: PrisonerProfileService, userService: UserService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      const profile = await prisonerProfileService.getProfileById(user.token, id)
      req.context.profile = profile

      if (profile.modifiedBy) {
        const modifiedByUser = await userService.getUserByUsername(user.token, profile.modifiedBy)
        req.context.profile.modifiedByName = modifiedByUser.name
      }

      next()
    } catch (err) {
      // Handle no profile
      if (err?.data?.status === 400 && err?.data?.userMessage.indexOf('Readiness profile does not exist') > -1) {
        next()
        return
      }
      // handle no user account
      if (err?.data?.field === 'username') {
        next()
        return
      }
      next(err)
    }
  }

export default getProfileByIdResolver
