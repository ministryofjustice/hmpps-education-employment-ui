import { Router } from 'express'

import ArchivedJobsController from './archivedJobsController'
import type { Services } from '../../../services'
import getArchivedJobsResolver from '../../../middleware/resolvers/getArchivedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new ArchivedJobsController(services.paginationService)
  router.get(
    '/cms/:id/jobs/archived',
    [getPrisonerByIdResolver(services.prisonerSearchService), getArchivedJobsResolver(services.jobService)],
    controller.get,
  )

  router.post('/cms/:id/jobs/archived', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
