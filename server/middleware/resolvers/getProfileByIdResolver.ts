import type { RequestHandler } from 'express'
import { UserService } from '../../services'

import PrisonerProfileService from '../../services/prisonerProfileService'
import { getUserFullName } from './utils'

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
        req.context.profile.modifiedByName = await getUserFullName(req, res, userService, profile.modifiedBy)
      }

      if (profile.profileData?.supportDeclined?.modifiedBy) {
        req.context.profile.profileData.supportDeclined.modifiedByName = await getUserFullName(
          req,
          res,
          userService,
          profile.profileData.supportDeclined.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.actionsRequired?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.actionsRequired.modifiedByName = await getUserFullName(
          req,
          res,
          userService,
          profile.profileData.supportAccepted.actionsRequired.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.workImpacts?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.workImpacts.modifiedByName = await getUserFullName(
          req,
          res,
          userService,
          profile.profileData.supportAccepted.workImpacts.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.workExperience?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.workExperience.modifiedByName = await getUserFullName(
          req,
          res,
          userService,
          profile.profileData.supportAccepted.workExperience.modifiedBy,
        )
      }

      if (profile.profileData?.supportAccepted?.workInterests?.modifiedBy) {
        req.context.profile.profileData.supportAccepted.workInterests.modifiedByName = await getUserFullName(
          req,
          res,
          userService,
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

export default getProfileByIdResolver
