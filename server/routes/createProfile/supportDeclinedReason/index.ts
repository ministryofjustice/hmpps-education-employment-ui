import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../services'
import SupportDeclinedReasonController from './supportDeclinedReasonController'

export default (router: Router, services: Services) => {
  const controller = new SupportDeclinedReasonController(services.prisonerProfileService)

  router.get(
    '/profile/create/:id/support-declined-reason/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/profile/create/:id/support-declined-reason/:mode',
    [
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      parseCheckBoxValue('supportDeclinedReason'),
    ],
    controller.post,
  )
}
