import type { Router } from 'express'

import getPrisonerByIdResolver from '../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../middleware/resolvers/getProfileByIdResolver'
import { Services } from '../../services'
import WorkProfileController from './workProfileController'

export default (router: Router, services: Services) => {
  const controller = new WorkProfileController()

  router.get(
    '/work-profile/:id/view/:tab',
    [getPrisonerByIdResolver(services.prisonerSearch), getProfileByIdResolver(services.prisonerProfileService)],
    controller.get,
  )
}
