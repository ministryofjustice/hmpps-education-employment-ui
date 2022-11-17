import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import CheckYourAnswersController from './checkYourAnswersController'

export default (router: Router, services: Services) => {
  const controller = new CheckYourAnswersController(services.prisonerProfileService)

  router.get(
    '/work-profile/create/:id/check-answers',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post(
    '/work-profile/create/:id/check-answers',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.post,
  )
}
