import { type RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonSearchService'

const MODULE_ROUTES: Record<string, string> = {
  mjma: '/mjma/prisoners?sort=releaseDate&order=ascending',
  wr: '/wr/cohort-list?sort=releaseDate&order=ascending',
}

function getContinueUrl(module: string): string {
  return MODULE_ROUTES[module] || MODULE_ROUTES.wr
}

const checkPrisonerProfileViewCriteria =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id, module } = req.params
    const { userActiveCaseLoad, username } = res.locals

    try {
      const searchByPrisonIdResponse = await prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId(
        username,
        userActiveCaseLoad.caseLoadId,
        id,
      )
      if (searchByPrisonIdResponse.empty || !searchByPrisonIdResponse.content[0]?.releaseDate?.trim()) {
        res.status(404).render('notFoundPage.njk', {
          continueUrl: getContinueUrl(module),
        })
        return
      }
    } catch (err) {
      res.status(404).render('notFoundPage.njk', {
        continueUrl: getContinueUrl(module),
      })
      return
    }
    next()
  }

export default checkPrisonerProfileViewCriteria
