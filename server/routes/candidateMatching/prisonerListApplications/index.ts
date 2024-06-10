import { Router } from 'express'
import PrisonerListApplicationsController from './prisonerListApplicationsController'
import type { Services } from '../../../services'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new PrisonerListApplicationsController(services.paginationService)
  router.get('/cms/applications', [], controller.get)

  router.post('/cms/applications', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
