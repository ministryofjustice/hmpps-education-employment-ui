import { Router } from 'express'
import CohortListController from './cohortListController'
import type { Services } from '../../../services'
import getCohortListResolver from '../../../middleware/resolvers/getCohortListResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new CohortListController(services.prisonerSearchService, services.paginationService)
  router.get('/', [getCohortListResolver(services.prisonerSearchService)], controller.get)

  router.post('/', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
