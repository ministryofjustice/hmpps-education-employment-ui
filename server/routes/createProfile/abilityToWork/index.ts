import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import AbilityToWorkController from './abilityToWorkController'

export default (router: Router, services: Services) => {
  const controller = new AbilityToWorkController()

  router.get(
    '/work-profile/create/:id/ability-to-work/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post('/work-profile/create/:id/ability-to-work/:mode', [parseCheckBoxValue('abilityToWork')], controller.post)
}
