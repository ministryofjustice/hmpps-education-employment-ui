import { Router } from 'express'

import type { Services } from '../../../services'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import ManageApplicationController from './manageApplicationController'
import getApplicationProgressResolver from '../../../middleware/resolvers/getApplicationProgressResolver'
import getCurrentPathMiddleware from '../../../middleware/resolvers/utils/getCurrentPageUrl'
import JourneyTypeValue from '../../../enums/journeyTypeValue'

export default (router: Router, services: Services) => {
  const controller = new ManageApplicationController(services.jobApplicationService)
  router.get(
    '/mjma/:id/job/:jobId/application/:mode',
    [
      getCurrentPathMiddleware(JourneyTypeValue.VIEW_APPLICATION),
      getPrisonerByIdResolver(services.prisonerSearchService),
      getJobDetailsResolver(services.jobService),
      getApplicationProgressResolver(services.jobApplicationService, services.userService),
    ],
    controller.get,
  )

  router.post(
    '/mjma/:id/job/:jobId/application/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getApplicationProgressResolver(services.jobApplicationService, services.userService),
    ],
    controller.post,
  )
}
