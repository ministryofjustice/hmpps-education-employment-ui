import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import SupportDeclinedReasonController from './alreadyInPlaceController'

export default (router: Router, services: Services) => {
  const controller = new SupportDeclinedReasonController()

  router.get(
    '/work-profile/create/:id/already-in-place/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post(
    '/work-profile/create/:id/already-in-place/:mode',
    [parseCheckBoxValue('alreadyInPlace')],
    controller.post,
  )
}
