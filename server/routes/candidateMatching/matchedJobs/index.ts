import { Router } from 'express'
import MatchedJobsController from './matchedJobsController'
import type { Services } from '../../../services'
import getMatchedJobsResolver from '../../../middleware/resolvers/getMatchedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'

export default (router: Router, services: Services) => {
  const controller = new MatchedJobsController(services.paginationService)
  router.get('/cms/jobs/matched', [getMatchedJobsResolver(services.jobService)], controller.get)

  router.post('/cms/jobs/matched', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
