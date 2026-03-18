import { Router } from 'express'

import ArchivedJobsController from './archivedJobsController'
import type { Services } from '../../../services'
import getArchivedJobsResolver from '../../../middleware/resolvers/getArchivedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import checkPrisonerProfileViewCriteria from '../../../middleware/checkPrisonerProfileViewCriteria'

export default (router: Router, services: Services) => {
  const controller = new ArchivedJobsController(services.paginationService)
  router.get(
    '/mjma/:id/jobs/archived',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getArchivedJobsResolver(services.jobService, services.deliusIntegrationService),
    ],
    controller.get,
  )

  router.post('/mjma/:id/jobs/archived', [handleSortMiddleware('sortAction', 'releaseDate')], controller.post)
}
