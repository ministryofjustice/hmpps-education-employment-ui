import { Router } from 'express'

import type { Services } from '../../../services'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import JobDetailsController from './jobDetailsController'

export default (router: Router, services: Services) => {
  const controller = new JobDetailsController()
  router.get(
    '/cms/:id/jobs/details/:employerName',
    [getPrisonerByIdResolver(services.prisonerSearchService), getJobDetailsResolver(services.jobService)],
    controller.get,
  )

  router.post('/cms/:id/jobs/details/:employerName', controller.post)
}
