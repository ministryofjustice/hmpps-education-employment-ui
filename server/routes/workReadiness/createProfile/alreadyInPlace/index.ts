import type { Router } from 'express'
import parseCheckBoxValue from '../../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../../services'
import AlreadyInPlaceController from './alreadyInPlaceController'
import checkPrisonerProfileViewCriteria from '../../../../middleware/checkPrisonerProfileViewCriteria'

export default (router: Router, services: Services) => {
  const controller = new AlreadyInPlaceController()

  router.get(
    '/wr/profile/create/:id/already-in-place/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/already-in-place/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      parseCheckBoxValue('alreadyInPlace'),
    ],
    controller.post,
  )
}
