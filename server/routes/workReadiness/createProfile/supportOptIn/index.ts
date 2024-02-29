import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../../services'
import SupportOptInController from './supportOptInController'

export default (router: Router, services: Services) => {
  const controller = new SupportOptInController()

  router.get(
    '/wr/profile/create/:id/support-opt-in/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post('/wr/profile/create/:id/support-opt-in/:mode', controller.post)
}
