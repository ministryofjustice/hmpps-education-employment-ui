import type { RequestHandler, Request } from 'express'

import { UserService } from '../../services'
import PrisonerProfileService from '../../services/prisonerProfileService'

// Gets profile based on id parameter and puts it into request context
const getNotesResolver =
  (prisonerProfileService: PrisonerProfileService, userService: UserService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id, action } = req.params
    const { user } = res.locals

    try {
      const notes = await prisonerProfileService.getNotes(user.token, id, action)
      req.context.notes = notes

      next()
    } catch (err) {
      next(err)
    }
  }

export default getNotesResolver
