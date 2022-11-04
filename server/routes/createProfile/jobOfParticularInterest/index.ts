import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import JobOfParticularInterestController from './jobOfParticularInterestController'

export default (router: Router, services: Services) => {
  const controller = new JobOfParticularInterestController()

  router.get(
    '/work-profile/create/:id/job-of-particular-interest/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/work-profile/create/:id/job-of-particular-interest/:mode', controller.post)
}
