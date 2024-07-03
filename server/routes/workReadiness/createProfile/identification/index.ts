import type { Router } from 'express'
import parseCheckBoxValue from '../../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../../services'
import IdentificationController from './identificationController'

export default (router: Router, services: Services) => {
  const controller = new IdentificationController()

  router.get(
    '/wr/profile/create/:id/identification/:mode',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post('/wr/profile/create/:id/identification/:mode', [parseCheckBoxValue('identification')], controller.post)
}
