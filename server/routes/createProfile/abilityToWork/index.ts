import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../services'
import AbilityToWorkController from './abilityToWorkController'

export default (router: Router, services: Services) => {
  const controller = new AbilityToWorkController(services.prisonerProfileService)

  router.get(
    '/profile/create/:id/ability-to-work/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/profile/create/:id/ability-to-work/:mode',
    [
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      parseCheckBoxValue('abilityToWork'),
    ],
    controller.post,
  )
}
