import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import ManageDrugsAndAlcoholController from './manageDrugsAndAlcoholController'

export default (router: Router, services: Services) => {
  const controller = new ManageDrugsAndAlcoholController()

  router.get(
    '/work-profile/create/:id/manage-drugs-and-alcohol/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/work-profile/create/:id/manage-drugs-and-alcohol/:mode', controller.post)
}
