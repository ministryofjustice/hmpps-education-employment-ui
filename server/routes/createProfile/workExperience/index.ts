import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../services'
import WorkExperienceController from './workExperienceController'

export default (router: Router, services: Services) => {
  const controller = new WorkExperienceController(services.prisonerProfileService)

  router.get(
    '/profile/create/:id/work-experience/:mode',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/profile/create/:id/work-experience/:mode',
    [getProfileByIdResolver(services.prisonerProfileService, services.userService)],
    controller.post,
  )
}
