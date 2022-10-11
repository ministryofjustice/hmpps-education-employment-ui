import { Router } from 'express'
import CohortListController from './cohortListController'
import type { Services } from '../../services'
import { handleSortMiddleware } from '../../middleware/prisonerSort'

export default (router: Router, services: Services) => {
  const controller = new CohortListController(services.prisonerSearch, services.paginationService)
  router.get('/work-profile/cohort-list', controller.get)

  // TODO: implement POST method
  router.post('/work-profile/cohort-list', [handleSortMiddleware('sortAction', 'lastName')], controller.post)
}
