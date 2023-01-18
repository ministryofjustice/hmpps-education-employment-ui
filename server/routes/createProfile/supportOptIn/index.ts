import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import SupportOptInController from './supportOptInController'

export default (router: Router, services: Services) => {
  const controller = new SupportOptInController()

  router.get(
    '/profile/create/:id/support-opt-in/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/profile/create/:id/support-opt-in/:mode', controller.post)
}
