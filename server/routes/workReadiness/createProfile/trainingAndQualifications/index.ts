import type { Router } from 'express'
import parseCheckBoxValue from '../../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../../services'
import TrainingAndQualificationsController from './trainingAndQualificationsController'

export default (router: Router, services: Services) => {
  const controller = new TrainingAndQualificationsController(services.prisonerProfileService)

  router.get(
    '/profile/create/:id/training-and-qualifications/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/profile/create/:id/training-and-qualifications/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      parseCheckBoxValue('trainingAndQualifications'),
    ],
    controller.post,
  )
}
