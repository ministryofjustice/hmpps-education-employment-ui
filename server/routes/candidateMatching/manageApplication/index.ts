import { Router } from 'express'

import type { Services } from '../../../services'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import ManageApplicationController from './manageApplicationController'

export default (router: Router, services: Services) => {
  const controller = new ManageApplicationController()
  router.get(
    '/cms/:id/job/:jobId/application/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService), getJobDetailsResolver(services.jobService)],
    controller.get,
  )
}
