import { Router } from 'express'
import CohortListController from './cohortListController'
import type { Services } from '../../services'

export default (router: Router, services: Services) => {
  const controller = new CohortListController(services.prisonerSearch, services.paginationService)
  router.get('/work-profile/cohort-list', controller.get)

  // TODO: implement POST method
  // router.post('/work-profile/cohort-list', controller.post)
}
