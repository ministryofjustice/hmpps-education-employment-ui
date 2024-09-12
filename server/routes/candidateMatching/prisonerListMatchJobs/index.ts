import { Router } from 'express'
import PrisonerListMatchJobsController from './prisonerListMatchJobsController'
import type { Services } from '../../../services'
import getPrisonerListMatchJobsResolver from '../../../middleware/resolvers/getPrisonerListMatchJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new PrisonerListMatchJobsController(services.paginationService)
  router.get(
    '/mjma/prisoners',
    [getPrisonerListMatchJobsResolver(services.prisonerProfileService, services.deliusIntegrationService)],
    controller.get,
  )

  router.post('/mjma/prisoners', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
