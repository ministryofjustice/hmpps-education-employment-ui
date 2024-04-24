import { Router } from 'express'

import FlaggedJobsController from './flaggedJobsController'
import type { Services } from '../../../services'
import getFlaggedJobsResolver from '../../../middleware/resolvers/getFlaggedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new FlaggedJobsController(services.paginationService)
  router.get(
    '/cms/:id/jobs/flagged',
    [getPrisonerByIdResolver(services.prisonerSearchService), getFlaggedJobsResolver(services.jobService)],
    controller.get,
  )

  router.post('/cms/:id/jobs/flagged', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
