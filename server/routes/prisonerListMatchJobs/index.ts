import { Router } from 'express'
import PrisonerListMatchJobsController from './prisonerListMatchJobsController'
import type { Services } from '../../services'
import getPrisonerListMatchedJobsResolver from '../../middleware/resolvers/getPrisonerListMatchJobsResolver'
import handleSortMiddleware from '../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new PrisonerListMatchJobsController(services.prisonerSearchService, services.paginationService)
  router.get('/cms/prisoners', [getPrisonerListMatchedJobsResolver(services.prisonerSearchService)], controller.get)

  router.post('/cms/prisoners', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
