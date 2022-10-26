import type { Router } from 'express'

import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import WhatNeedsToChangeController from './whatNeedsToChangeController'

export default (router: Router, services: Services) => {
  const controller = new WhatNeedsToChangeController()

  router.get(
    '/work-profile/create/:id/what-needs-to-change/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post(
    '/work-profile/create/:id/what-needs-to-change/:mode',
    [parseCheckBoxValue('whatNeedsToChange')],
    controller.post,
  )
}
