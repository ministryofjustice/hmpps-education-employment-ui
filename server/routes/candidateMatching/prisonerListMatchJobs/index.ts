import { Router } from 'express'
import PrisonerListMatchJobsController from './prisonerListMatchJobsController'
import type { Services } from '../../../services'
import getPrisonerListMatchJobsResolver from '../../../middleware/resolvers/getPrisonerListMatchJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new PrisonerListMatchJobsController(services.paginationService)
  router.get(
    '/cms/prisoners',
    [getPrisonerListMatchJobsResolver(services.prisonerProfileService, services.deliusIntegrationService)],
    controller.get,
  )

  router.post('/cms/prisoners', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
