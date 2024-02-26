import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../../services'
import NewStatusPauseController from './newStatusPauseController'

export default (router: Router, services: Services) => {
  const controller = new NewStatusPauseController()

  router.get(
    '/wr/profile/change-status/:id/pause',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/wr/profile/change-status/:id/pause',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.post,
  )
}
