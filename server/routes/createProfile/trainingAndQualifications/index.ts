import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../services'
import TrainingAndQualificationsController from './trainingAndQualificationsController'

export default (router: Router, services: Services) => {
  const controller = new TrainingAndQualificationsController()

  router.get(
    '/work-profile/create/:id/training-and-qualifications/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/work-profile/create/:id/training-and-qualifications/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
