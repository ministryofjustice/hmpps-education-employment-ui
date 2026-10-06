import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../../services'
import IneligableToWorkController from './ineligableToWorkController'
import checkPrisonerProfileViewCriteria from '../../../../middleware/checkPrisonerProfileViewCriteria'

export default (router: Router, services: Services) => {
  const controller = new IneligableToWorkController(services.prisonerProfileService)

  router.get(
    '/wr/profile/create/:id/ineligable-to-work/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/ineligable-to-work/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
    ],
    controller.post,
  )
}
