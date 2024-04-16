import { Router } from 'express'

import MatchedJobsController from './matchedJobsController'
import type { Services } from '../../../services'
import getMatchedJobsResolver from '../../../middleware/resolvers/getMatchedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'

export default (router: Router, services: Services) => {
  const controller = new MatchedJobsController(services.paginationService)
  router.get(
    '/cms/:id/jobs/matched',
    [
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getMatchedJobsResolver(services.jobService),
    ],
    controller.get,
  )

  router.post(
    '/cms/:id/jobs/matched',
    [
      handleSortMiddleware('sortAction', 'releaseDate'),
      parseCheckBoxValue('typeOfWorkFilter'),
      parseCheckBoxValue('typeOfWorkFilterOther'),
    ],
    controller.post,
  )
}
