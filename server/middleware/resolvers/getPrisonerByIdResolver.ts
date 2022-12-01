import { plainToClass } from 'class-transformer'
import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import PrisonerViewModel from '../../viewModels/prisonerViewModel'
import { getSessionData, setSessionData } from '../../utils/session'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerByIdResolver =
  (prisonerSearch: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      // Check session for cached prisoner
      if (getSessionData(req, ['prisoner', id])) {
        req.context.prisoner = getSessionData(req, ['prisoner', id])
        next()
        return
      }

      // Get prisoner
      const prisoner = await prisonerSearch.getPrisonerById(user.token, id)
      req.context.prisoner = plainToClass(PrisonerViewModel, prisoner)
      setSessionData(req, ['prisoner', id], req.context.prisoner)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getPrisonerByIdResolver
