import type { Router } from 'express'
import parseCheckBoxValue from '../../../../middleware/parseCheckBoxValue'
import getNotesResolver from '../../../../middleware/resolvers/getNotesResolver'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../../services'
import EditActionController from './editActionController'

export default (router: Router, services: Services) => {
  const controller = new EditActionController(services.prisonerProfileService)

  router.get(
    '/wr/profile/actions/:id/edit/:action',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getNotesResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/actions/:id/edit/:action',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getNotesResolver(services.prisonerProfileService, services.userService),
      parseCheckBoxValue('identification'),
    ],
    controller.post,
  )
}
