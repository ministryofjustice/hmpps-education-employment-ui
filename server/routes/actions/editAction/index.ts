import type { Router } from 'express'
import getNotesResolver from '../../../middleware/resolvers/getNotesResolver'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../services'
import EditActionController from './editActionController'

export default (router: Router, services: Services) => {
  const controller = new EditActionController(services.prisonerProfileService)

  router.get(
    '/profile/actions/:id/edit/:action',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getNotesResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/profile/actions/:id/edit/:action',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getNotesResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
