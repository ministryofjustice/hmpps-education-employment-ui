import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'

import type { Services } from '../../../services'
import NewStatusController from './editActionController'

export default (router: Router, services: Services) => {
  const controller = new NewStatusController(services.prisonerProfileService)

  router.get(
    '/work-profile/actions/:id/edit/:action',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/work-profile/actions/:id/edit/:action',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
