import type { Router } from 'express'

import { Services } from '../../services'
import WorkProfileController from './workProfileController'
import getEmployabilitySkillsResolver from '../../middleware/resolvers/getEmployabilitySkillsResolver'
import getKeyworkerByIdResolver from '../../middleware/resolvers/getKeyworkerByIdResolver'
import getLatestAssessmentResolver from '../../middleware/resolvers/getLatestAssessmentResolver'
import getLearnerEducationResolver from '../../middleware/resolvers/getLearnerEducationResolver'
import getNeurodivergenceResolver from '../../middleware/resolvers/getNeurodivergenceResolver'
import getPrisonerByIdResolver from '../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../middleware/resolvers/getProfileByIdResolver'
import getCurrentOffenderActivitiesResolver from '../../middleware/resolvers/getCurrentOffenderActivitiesResolver'
import getUnacceptableAbsencesCountResolver from '../../middleware/resolvers/getUnacceptableAbsencesCountResolver'

import getPomByIdResolver from '../../middleware/resolvers/getPomByIdResolver'

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
      getCurrentOffenderActivitiesResolver(services.prisonService),
      getUnacceptableAbsencesCountResolver(services.whereaboutsService),
      getKeyworkerByIdResolver(services.keyworkerService),
      getPomByIdResolver(services.allocationManagerService),
    ],
    controller.get,
  )
}
