import type { Router } from 'express'

import getEmployabilitySkillsResolver from '../../middleware/resolvers/getEmployabilitySkillsResolver'
import getKeyworkerByIdResolver from '../../middleware/resolvers/getKeyworkerByIdResolver'
import getLatestAssessmentResolver from '../../middleware/resolvers/getLatestAssessmentResolver'
import getLearnerEducationResolver from '../../middleware/resolvers/getLearnerEducationResolver'
import getNeurodivergenceResolver from '../../middleware/resolvers/getNeurodivergenceResolver'
import getPrisonerByIdResolver from '../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../middleware/resolvers/getProfileByIdResolver'
import getCurrentOffenderActivitiesResolver from '../../middleware/resolvers/getCurrentOffenderActivitiesResolver'
import getUnacceptableAbsencesCountResolver from '../../middleware/resolvers/getUnacceptableAbsencesCountResolver'
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
      getKeyworkerByIdResolver(services.keyworkerService),
      getCurrentOffenderActivitiesResolver(services.prisonService),
      getUnacceptableAbsencesCountResolver(services.whereaboutsService),
    ],
    controller.get,
  )
}
