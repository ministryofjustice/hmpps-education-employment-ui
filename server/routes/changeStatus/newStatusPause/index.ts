import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import NewStatusPauseController from './newStatusPauseController'

export default (router: Router, services: Services) => {
  const controller = new NewStatusPauseController(services.prisonerProfileService)

  router.get(
    '/work-profile/change-status/:id/pause',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post(
    '/work-profile/change-status/:id/pause',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.post,
  )
}
