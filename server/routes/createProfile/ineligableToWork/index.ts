import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import IneligableToWorkController from './ineligableToWorkController'

export default (router: Router, services: Services) => {
  const controller = new IneligableToWorkController(services.prisonerProfileService)

  router.get(
    '/profile/create/:id/ineligable-to-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post(
    '/profile/create/:id/ineligable-to-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.post,
  )
}
