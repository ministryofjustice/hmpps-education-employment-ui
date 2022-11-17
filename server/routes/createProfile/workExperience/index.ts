import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import WorkExperienceController from './workExperienceController'

export default (router: Router, services: Services) => {
  const controller = new WorkExperienceController()

  router.get(
    '/work-profile/create/:id/work-experience/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/work-profile/create/:id/work-experience/:mode', controller.post)
}
