import type { RequestHandler, Request } from 'express'
import { UserService } from '../../services'

import PrisonerProfileService from '../../services/prisonerProfileService'
import { getSessionData, setSessionData } from '../../utils/session'

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
        req.context.profile.modifiedByName = await getUserFullName(req, userService, user.token, profile.modifiedBy)
      }

      if (profile.profileData?.supportDeclined?.modifiedBy) {
        req.context.profile.profileData.supportDeclined.modifiedByName = await getUserFullName(
          req,
          userService,
          user.token,
          profile.profileData.supportDeclined.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.actionsRequired?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.actionsRequired.modifiedByName = await getUserFullName(
          req,
          userService,
          user.token,
          profile.profileData.supportAccepted.actionsRequired.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.workImpacts?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.workImpacts.modifiedByName = await getUserFullName(
          req,
          userService,
          user.token,
          profile.profileData.supportAccepted.workImpacts.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.workExperience?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.workExperience.modifiedByName = await getUserFullName(
          req,
          userService,
          user.token,
          profile.profileData.supportAccepted.workExperience.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.workInterests?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.workInterests.modifiedByName = await getUserFullName(
          req,
          userService,
          user.token,
          profile.profileData.supportAccepted.workInterests.modifiedBy,
        )
      }

      next()
    } catch (err) {
      // Handle no profile
      if (err?.data?.status === 400 && err?.data?.userMessage.indexOf('Readiness profile does not exist') > -1) {
        next()
        return
      }

      next(err)
    }
  }

const getUserFullName = async (req: Request, userService: UserService, token: string, userName: string) => {
  try {
    let name = getSessionData(req, ['userNameCache', userName], '')
    if (!name) {
      const found = await userService.getUserByUsername(token, userName)
      name = found.name
      setSessionData(req, ['userNameCache', userName], found.name)
    }

    return name || userName
  } catch (err) {
    // handle no user account
    if (err?.data?.field === 'username') {
      return userName
    }

    throw err
  }
}

export default getProfileByIdResolver
