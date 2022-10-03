import type { Router, RequestHandler } from 'express'

import type { Services } from '../../../services'
import PrisonerSearchService from '../../../services/prisonSearchService'
import RightToWorkController from './RightToWorkController'

export default (router: Router, services: Services) => {
  const controller = new RightToWorkController()

  router.get(
    '/work-profile/create/:id/right-to-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/work-profile/create/:id/right-to-work/:mode', controller.post)
}

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
