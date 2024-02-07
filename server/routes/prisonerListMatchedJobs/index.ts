import { Router } from 'express'
import PrisonerListMatchedJobsController from './prisonerListMatchedJobsController'
import type { Services } from '../../services'
import getPrisonerListMatchedJobsResolver from '../../middleware/resolvers/getPrisonerListMatchedJobsResolver'
import handleSortMiddleware from '../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new PrisonerListMatchedJobsController(services.prisonerSearchService, services.paginationService)
  router.get('/cms/prisoners', [getPrisonerListMatchedJobsResolver(services.prisonerSearchService)], controller.get)

  router.post('/cms/prisoners', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
