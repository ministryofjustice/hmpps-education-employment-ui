import type { Router } from 'express'

import parseCheckBoxValue from '../../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../../services'
import WhatNeedsToChangeController from './whatNeedsToChangeController'

export default (router: Router, services: Services) => {
  const controller = new WhatNeedsToChangeController(services.prisonerProfileService)

  router.get(
    '/wr/profile/create/:id/what-needs-to-change/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/what-needs-to-change/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      parseCheckBoxValue('whatNeedsToChange'),
    ],
    controller.post,
  )
}
