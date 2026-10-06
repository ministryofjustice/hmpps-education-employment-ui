import type { Router } from 'express'

import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import type { Services } from '../../../../services'
import JobOfParticularInterestController from './jobOfParticularInterestController'
import checkPrisonerProfileViewCriteria from '../../../../middleware/checkPrisonerProfileViewCriteria'

export default (router: Router, services: Services) => {
  const controller = new JobOfParticularInterestController(services.prisonerProfileService)

  router.get(
    '/wr/profile/create/:id/job-of-particular-interest/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
  router.post(
    '/wr/profile/create/:id/job-of-particular-interest/:mode',
    [
      checkPrisonerProfileViewCriteria(services.prisonerSearchService, services.prisonerProfileService),
      getPrisonerByIdResolver(services.prisonerSearchService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.post,
  )
}
