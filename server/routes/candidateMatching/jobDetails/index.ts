import { Router } from 'express'

import type { Services } from '../../../services'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import JobDetailsController from './jobDetailsController'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import getPrisonerAddressByIdResolver from '../../../middleware/resolvers/getPrisonerAddressByIdResolver'
import getCurrentPathMiddleware from '../../../middleware/resolvers/utils/getCurrentPageUrl'

export default (router: Router, services: Services) => {
  const controller = new JobDetailsController(services.jobService)
  router.get(
    '/mjma/:id/job/:jobId/details',
    [
      getCurrentPathMiddleware,
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getPrisonerAddressByIdResolver(services.deliusIntegrationService),
      getJobDetailsResolver(services.jobService),
    ],
    controller.get,
  )

  router.post('/mjma/:id/job/:jobId/details', controller.post)
}
