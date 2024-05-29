import { Router } from 'express'

import type { Services } from '../../../services'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import ManageApplicationController from './manageApplicationController'
import getApplicationProgressResolver from '../../../middleware/resolvers/getApplicationProgressResolver'

export default (router: Router, services: Services) => {
  const controller = new ManageApplicationController(services.jobApplicationService)
  router.get(
    '/cms/:id/job/:jobId/application/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getJobDetailsResolver(services.jobService),
      getApplicationProgressResolver(services.jobApplicationService),
    ],
    controller.get,
  )

  router.post(
    '/cms/:id/job/:jobId/application/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
