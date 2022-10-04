import type { RequestHandler } from 'express'

import PrisonerSearchService from '../../services/prisonSearchService'

// Gets prisoner based on id parameter and puts it into request context
const getPrisonerByIdResolver =
  (prisonerSearch: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { user } = res.locals

    try {
      req.context.prisoner = await prisonerSearch.getPrisonerById(user.token, id)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getPrisonerByIdResolver
