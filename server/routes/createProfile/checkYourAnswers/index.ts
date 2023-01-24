import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../services'
import CheckYourAnswersController from './checkYourAnswersController'

export default (router: Router, services: Services) => {
  const controller = new CheckYourAnswersController(services.prisonerProfileService)

  router.get('/profile/create/:id/check-answers', [getPrisonerByIdResolver(services.prisonerSearch)], controller.get)
  router.post(
    '/profile/create/:id/check-answers',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
