import type { Router } from 'express'
import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'

import type { Services } from '../../../../services'
import RightToWorkController from './rightToWorkController'
import checkPrisonerProfileViewCriteria from '../../../../middleware/checkPrisonerProfileViewCriteria'

export default (router: Router, services: Services) => {
  const controller = new RightToWorkController()

  router.get(
    '/wr/profile/create/:id/right-to-work/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/right-to-work/:mode',
    [checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService)],
    controller.post,
  )
}
