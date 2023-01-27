import type { Router } from 'express'

import getEmployabilitySkillsResolver from '../../middleware/resolvers/getEmployabilitySkillsResolver'
import getLatestAssessmentResolver from '../../middleware/resolvers/getLatestAssessmentResolver'
import getLearnerEducationResolver from '../../middleware/resolvers/getLearnerEducationResolver'
import getNeurodivergenceResolver from '../../middleware/resolvers/getNeurodivergenceResolver'
import getPrisonerByIdResolver from '../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../middleware/resolvers/getProfileByIdResolver'
import { Services } from '../../services'
import WorkProfileController from './workProfileController'

export default (router: Router, services: Services) => {
  const controller = new WorkProfileController()

  router.get(
    '/profile/:id/view/:tab',
    [
      getPrisonerByIdResolver(services.prisonerSearch),
      getEmployabilitySkillsResolver(services.curiousEsweService),
      getLatestAssessmentResolver(services.curiousEsweService),
      getLearnerEducationResolver(services.curiousEsweService),
      getNeurodivergenceResolver(services.curiousEsweService),
      getProfileByIdResolver(services.prisonerProfileService, services.userService),
    ],
    controller.get,
  )
}
