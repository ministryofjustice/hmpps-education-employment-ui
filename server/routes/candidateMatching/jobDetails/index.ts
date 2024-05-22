import { Router } from 'express'

import type { Services } from '../../../services'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import JobDetailsController from './jobDetailsController'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new JobDetailsController()
  router.get(
    '/cms/:id/job/:jobId/details',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getJobDetailsResolver(services.jobService),
    ],
    controller.get,
  )
}
