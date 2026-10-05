import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../../services'
import SupportOptInController from './supportOptInController'
import checkPrisonerProfileViewCriteria from '../../../../middleware/checkPrisonerProfileViewCriteria'

export default (router: Router, services: Services) => {
  const controller = new SupportOptInController()

  router.get(
    '/wr/profile/create/:id/support-opt-in/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/support-opt-in/:mode',
    [checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService)],
    controller.post,
  )
}
