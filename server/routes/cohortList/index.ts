import { Router } from 'express'
import CohortListController from './cohortListController'
import type { Services } from '../../services'
import { handleSortMiddleware } from '../../middleware/prisonerSort'
import getCohortListResolver from '../../middleware/resolvers/getCohortListResolver'

export default (router: Router, services: Services) => {
  const controller = new CohortListController(services.prisonerSearch, services.paginationService)
  router.get('/work-profile/cohort-list', [getCohortListResolver(services.prisonerSearch)], controller.get)

  // TODO: implement POST method
  router.post('/work-profile/cohort-list', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
