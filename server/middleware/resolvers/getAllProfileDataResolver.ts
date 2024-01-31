import type { RequestHandler } from 'express'
import { Services } from '../../services'

import getCurrentOffenderActivities from './utils/getCurrentOffenderActivities'
import getEmployabilitySkills from './utils/getEmployabilitySkills'
import getLearnerEducation from './utils/getLearnerEducation'
import getNeurodivergence from './utils/getNeurodivergence'
import getLatestAssessment from './utils/getLatestAssessment'
import getKeyworkerById from './utils/getKeyworkerById'
import getUnacceptibleAbsenceCount from './utils/getUnacceptableAbsenceCount'
import getComById from './utils/getComById'
import getPomById from './utils/getPomById'

// Gets profile data based on id parameter and puts it into request context
const getAllProfileDataResolver =
  (services: Services): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const {
      prisonerSearchService,
      keyworkerService,
      prisonService,
      curiousEsweService,
      whereaboutsService,
      deliusIntegrationService,
      allocationManagerService,
    } = services

    try {
      const [
        prisoner,
        employabilitySkills,
        learnerEducation,
        neurodivergence,
        learnerLatestAssessment,
        unacceptableAbsenceCount,
        keyworker,
      ] = await Promise.all([
        prisonerSearchService.getPrisonerById(username, id),
        getEmployabilitySkills(curiousEsweService, username, id),
        getLearnerEducation(curiousEsweService, username, id),
        getNeurodivergence(curiousEsweService, username, id),
        getLatestAssessment(curiousEsweService, username, id),
        getUnacceptibleAbsenceCount(whereaboutsService, username, id),
        getKeyworkerById(keyworkerService, username, id),
      ])

      req.context.prisoner = prisoner
      req.context.employabilitySkills = employabilitySkills
      req.context.learnerEducation = learnerEducation
      req.context.learnerLatestAssessment = learnerLatestAssessment
      req.context.neurodivergence = neurodivergence
      req.context.unacceptableAbsenceCount = unacceptableAbsenceCount
      req.context.keyworker = keyworker

      next()
    } catch (err) {
      next(err)
    }
  }

export default getAllProfileDataResolver
