import { Router } from 'express'
import PrisonerListApplicationsController from './prisonerListApplicationsController'
import type { Services } from '../../../services'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerListApplicationsResolver from '../../../middleware/resolvers/getPrisonerListApplicationsResolver'

export default (router: Router, services: Services) => {
  const controller = new PrisonerListApplicationsController(services.paginationService)
  router.get('/cms/applications', [getPrisonerListApplicationsResolver(services.jobApplicationService)], controller.get)

  router.post('/cms/applications', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
