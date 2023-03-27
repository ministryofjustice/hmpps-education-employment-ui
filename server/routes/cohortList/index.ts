import { Router } from 'express'
import CohortListController from './cohortListController'
import type { Services } from '../../services'
import { handleSortMiddleware } from '../../middleware/prisonerSort'
import getCohortListResolver from '../../middleware/resolvers/getCohortListResolver'

export default (router: Router, services: Services) => {
  const controller = new CohortListController(services.prisonerSearchService, services.paginationService)
  router.get('/', [getCohortListResolver(services.prisonerSearchService)], controller.get)

  // TODO: implement POST method
  router.post('/', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
