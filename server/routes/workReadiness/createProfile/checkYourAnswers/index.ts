import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../../services'
import CheckYourAnswersController from './checkYourAnswersController'

export default (router: Router, services: Services) => {
  const controller = new CheckYourAnswersController(services.prisonerProfileService)

  router.get(
    '/wr/profile/create/:id/check-answers',
    [getPrisonerByIdResolver(services.prisonerSearchService)],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/check-answers',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
