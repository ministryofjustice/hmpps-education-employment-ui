import { Router } from 'express'

import JobsOfInterestController from './jobsOfInterestController'
import type { Services } from '../../../services'
import getJobsOfInterestResolver from '../../../middleware/resolvers/getJobsOfInterestResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new JobsOfInterestController(services.paginationService)
  router.get(
    '/mjma/:id/jobs/interested',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getJobsOfInterestResolver(services.jobService, services.deliusIntegrationService),
    ],
    controller.get,
  )

  router.post('/mjma/:id/jobs/interested', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
