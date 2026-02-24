import type { Router } from 'express'

import { Services } from '../../services'
import WorkProfileController from './workProfileController'
import getProfileByIdResolver from '../../middleware/resolvers/getProfileByIdResolver'
import getAllProfileDataResolver from '../../middleware/resolvers/getAllProfileDataResolver'
import checkCmsEnabledProfile from '../../middleware/checkCmsEnabledProfile'
import checkPrisonerInActiveCaseLoad from '../../middleware/checkPrisonerInActiveCaseLoad'

export default (router: Router, services: Services) => {
  const controller = new WorkProfileController()

  router.get(
    '/:module/profile/:id/view/:tab',
    [
      checkPrisonerInActiveCaseLoad(services.prisonerSearchService),
      checkCmsEnabledProfile,
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getAllProfileDataResolver(services),
    ],
    controller.get,
  )
}
