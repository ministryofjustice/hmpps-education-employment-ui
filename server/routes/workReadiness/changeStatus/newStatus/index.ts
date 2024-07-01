import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'

import type { Services } from '../../../../services'
import NewStatusController from './newStatusController'

export default (router: Router, services: Services) => {
  const controller = new NewStatusController(services.prisonerProfileService)

  router.get(
    '/wr/profile/change-status/:id/new-status',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/change-status/:id/new-status',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
