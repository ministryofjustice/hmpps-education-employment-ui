import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

import type { Services } from '../../../services'
import NewStatusController from './newStatusController'

export default (router: Router, services: Services) => {
  const controller = new NewStatusController()

  router.get(
    '/work-profile/change-status/:id/new-status',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/work-profile/change-status/:id/new-status', controller.post)
}
