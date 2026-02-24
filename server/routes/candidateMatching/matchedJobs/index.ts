import { Router } from 'express'

import MatchedJobsController from './matchedJobsController'
import type { Services } from '../../../services'
import getMatchedJobsResolver from '../../../middleware/resolvers/getMatchedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getPrisonerAddressByIdResolver from '../../../middleware/resolvers/getPrisonerAddressByIdResolver'
import getCurrentPathMiddleware from '../../../middleware/resolvers/utils/getCurrentPageUrl'
import JourneyTypeValue from '../../../enums/journeyTypeValue'

export default (router: Router, services: Services) => {
  const controller = new MatchedJobsController(services.paginationService)
  router.get(
    '/mjma/:id/jobs/matched',
    [
      getCurrentPathMiddleware(JourneyTypeValue.MATCHED_JOBS),
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
      getPrisonerAddressByIdResolver(services.deliusIntegrationService),
      getMatchedJobsResolver(services.jobService),
    ],
    controller.get,
  )

  router.post(
    '/mjma/:id/jobs/matched',
    [
      handleSortMiddleware('sortAction', 'releaseDate'),
      parseCheckBoxValue('jobSectorFilter'),
      parseCheckBoxValue('jobSectorFilterOther'),
    ],
    controller.post,
  )
}
