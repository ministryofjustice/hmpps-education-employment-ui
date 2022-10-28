import { plainToClass } from 'class-transformer'
import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'
import PrisonerViewModel from '../../viewModels/prisonerViewModel'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerByIdResolver =
  (prisonerSearch: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      const prisoner = await prisonerSearch.getPrisonerById(user.token, id)
      req.context.prisoner = plainToClass(PrisonerViewModel, prisoner)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getPrisonerByIdResolver
