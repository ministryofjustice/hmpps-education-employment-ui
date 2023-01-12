import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

import type { Services } from '../../../services'
import EditActionController from './editActionController'

export default (router: Router, services: Services) => {
  const controller = new EditActionController(services.prisonerProfileService)

  router.get(
    '/work-profile/actions/:id/edit/:action',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post(
    '/work-profile/actions/:id/edit/:action',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.post,
  )
}
