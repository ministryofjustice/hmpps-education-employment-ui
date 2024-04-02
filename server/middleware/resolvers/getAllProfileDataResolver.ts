/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from 'express'
import { Services } from '../../services'

import getCurrentOffenderActivities from './utils/getCurrentOffenderActivities'
import getEmployabilitySkills from './utils/getEmployabilitySkills'
import getLearnerEducation from './utils/getLearnerEducation'
import getNeurodivergence from './utils/getNeurodivergence'
import getLatestAssessment from './utils/getLatestAssessment'
import getKeyworkerById from './utils/getKeyworkerById'
import getUnacceptibleAbsenceCount from './utils/getUnacceptableAbsenceCount'
import getMatchedJobs from './utils/getMatchedJobs'
import getFlaggedJobs from './utils/getFlaggedJobs'
import getOpenApplications from './utils/getOpenApplications'
import getClosedApplications from './utils/getClosedApplications'
import getComById from './utils/getComById'
import getPomById from './utils/getPomById'

// Gets profile data based on id parameter and puts it into request context
const getAllProfileDataResolver =
  (services: Services): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id, tab, module } = req.params
    const { username } = res.locals.user
    const { prisonerSearchService } = services

    try {
      const prisoner = await prisonerSearchService.getPrisonerById(username, id)
      req.context.prisoner = prisoner

      if (tab === 'details') {
        await getPersonalTabData(req, res, services)
      }

      if (tab === 'contacts') {
        await getContactTabData(req, res, services)
      }

      if (tab === 'training') {
        await getTrainingTabData(req, res, services)
      }

      if (tab === 'overview' && module === 'cms') {
        await getCmsData(req, res, services)
      }

      next()
    } catch (err) {
      next(err)
    }
  }

const getPersonalTabData = async (req: any, res: any, services: Services): Promise<void> => {
  const { id } = req.params
  const { username } = res.locals.user
  const { curiousEsweService } = services

  const neurodivergence = await getNeurodivergence(curiousEsweService, username, id)

  req.context.neurodivergence = neurodivergence
}

const getContactTabData = async (req: any, res: any, services: Services): Promise<void> => {
  const { id } = req.params
  const { username } = res.locals.user
  const { keyworkerService, deliusIntegrationService, allocationManagerService } = services

  // TODO: put failing calls back in
  const [com, pom, keyworker] = await Promise.all([
    getComById(deliusIntegrationService, username, id),
    getPomById(allocationManagerService, username, id),
    getKeyworkerById(keyworkerService, username, id),
  ])

  req.context.com = com
  req.context.pom = pom
  req.context.keyworker = keyworker
}

const getTrainingTabData = async (req: any, res: any, services: Services): Promise<void> => {
  const { id } = req.params
  const { username } = res.locals.user
  const { prisonService, curiousEsweService, whereaboutsService } = services

  const [
    currentOffenderActivities,
    employabilitySkills,
    learnerEducation,
    learnerLatestAssessment,
    unacceptableAbsenceCount,
  ] = await Promise.all([
    getCurrentOffenderActivities(prisonService, username, id),
    getEmployabilitySkills(curiousEsweService, username, id),
    getLearnerEducation(curiousEsweService, username, id),
    getLatestAssessment(curiousEsweService, username, id),
    getUnacceptibleAbsenceCount(whereaboutsService, username, id),
  ])

  req.context.currentOffenderActivities = currentOffenderActivities
  req.context.employabilitySkills = employabilitySkills
  req.context.learnerEducation = learnerEducation
  req.context.learnerLatestAssessment = learnerLatestAssessment
  req.context.unacceptableAbsenceCount = unacceptableAbsenceCount
}

const getCmsData = async (req: any, res: any, services: Services): Promise<void> => {
  const { id } = req.params
  const { username } = res.locals.user
  const { jobService, jobApplicationService } = services

  const [matchedJobs, flaggedJobs, openApplications, closedApplications] = await Promise.all([
    getMatchedJobs(jobService, username, id),
    getFlaggedJobs(jobService, username, id),
    getOpenApplications(jobApplicationService, username, id),
    getClosedApplications(jobApplicationService, username, id),
  ])

  req.context.matchedJobs = matchedJobs
  req.context.flaggedJobs = flaggedJobs
  req.context.openApplications = openApplications
  req.context.closedApplications = closedApplications
}

export default getAllProfileDataResolver
