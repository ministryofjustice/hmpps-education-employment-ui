import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'

import type { Services } from '../../../../services'
import RightToWorkController from './rightToWorkController'

export default (router: Router, services: Services) => {
  const controller = new RightToWorkController()

  router.get(
    '/wr/profile/create/:id/right-to-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post('/wr/profile/create/:id/right-to-work/:mode', controller.post)
}
