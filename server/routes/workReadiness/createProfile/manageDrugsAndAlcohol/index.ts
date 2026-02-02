import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../../services'
import ManageDrugsAndAlcoholController from './manageDrugsAndAlcoholController'

export default (router: Router, services: Services) => {
  const controller = new ManageDrugsAndAlcoholController(services.prisonerProfileService)

  router.get(
    '/wr/profile/create/:id/manage-drugs-and-alcohol/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/manage-drugs-and-alcohol/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
