import type { RequestHandler } from 'express'

import PrisonerProfileService from '../../services/prisonerProfileService'

// Gets profile based on id parameter and puts it into request context
const getProfileByIdResolver =
  (prisonerProfileService: PrisonerProfileService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      const profile = await prisonerProfileService.getProfileById(user.token, id)
      req.context.profile = profile

      next()
    } catch (err) {
      if (err?.data?.status === 400 && err?.data?.userMessage.indexOf('Readiness profile does not exist') > -1) {
        next()
        return
      }
      next(err)
    }
  }

export default getProfileByIdResolver
