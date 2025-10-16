import { Router } from 'express'

import NationalJobsController from './nationalJobsController'
import type { Services } from '../../../services'
import getNationalJobsResolver from '../../../middleware/resolvers/getNationalJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getPrisonerAddressByIdResolver from '../../../middleware/resolvers/getPrisonerAddressByIdResolver'
import getNationalEmployersListResolver from '../../../middleware/resolvers/getNationalEmployersListResolver'

export default (router: Router, services: Services) => {
  const controller = new NationalJobsController(services.paginationService)
  router.get(
    '/mjma/:id/jobs/national-jobs',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getPrisonerAddressByIdResolver(services.deliusIntegrationService),
      getNationalJobsResolver(services.jobService),
      getNationalEmployersListResolver(services.jobService),
    ],
    controller.get,
  )

  router.post(
    '/mjma/:id/jobs/national-jobs',
    [
      handleSortMiddleware('sortAction', 'releaseDate'),
      parseCheckBoxValue('jobSectorFilter'),
      parseCheckBoxValue('jobSectorFilterOther'),
    ],
    controller.post,
  )
}
