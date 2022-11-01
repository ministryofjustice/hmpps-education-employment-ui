import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import TypeOfWorkController from './typeOfWorkController'

export default (router: Router, services: Services) => {
  const controller = new TypeOfWorkController()

  router.get(
    '/work-profile/create/:id/type-of-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/work-profile/create/:id/type-of-work/:mode', [parseCheckBoxValue('typeOfWork')], controller.post)
}
