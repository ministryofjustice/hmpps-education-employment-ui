import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../services'
import TypeOfWorkController from './typeOfWorkController'

export default (router: Router, services: Services) => {
  const controller = new TypeOfWorkController(services.prisonerProfileService)

  router.get(
    '/work-profile/create/:id/type-of-work/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/work-profile/create/:id/type-of-work/:mode',
    [getProfileByIdResolver(services.prisonerProfileService, services.userService), parseCheckBoxValue('typeOfWork')],
    controller.post,
  )
}
