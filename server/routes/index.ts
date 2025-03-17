import { Router } from 'express'
import type { Services } from '../services'
import workReadinessRoutes from './workReadiness'
import accessibilityStatementRoutes from './accessibilityStatement'
import candidateMatchingRoutes from './candidateMatching'
import homePageRoutes from './homePage'
import apiRoutes from './api'
import workProfileRoutes from './workProfile'
import config from '../config'
import authorisationMiddleware, { AuthRole } from '../middleware/authorisationMiddleware'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })

  // Check for work readiness roles for wr end points
  router.all(
    '/wr/**',
    authorisationMiddleware([
      AuthRole.ROLE_WORK_READINESS_VIEWER,
      AuthRole.ROLE_WORK_READINESS_EDITOR,
      AuthRole.ROLE_WORK_READINESS_VIEW,
      AuthRole.ROLE_WORK_READINESS_EDIT,
    ]),
  )

  // Check for work plan roles for mjma end points
  router.all(
    '/mjma/**',
    authorisationMiddleware([
      AuthRole.ROLE_EDUCATION_WORK_PLAN_EDITOR,
      AuthRole.ROLE_EDUCATION_WORK_PLAN_VIEWER,
      AuthRole.ROLE_MATCH_JOBS_EDIT,
    ]),
  )

  // Append page routes
  homePageRoutes(router, services)
  accessibilityStatementRoutes(router)
  workProfileRoutes(router, services)

  // Work readiness routes
  workReadinessRoutes(router, services)

  // Candidate matching routes, only attach if mjma is enabled
  if (config.featureToggles.candidateMatchingEnabled) {
    candidateMatchingRoutes(router, services)
  }

  // API routes
  apiRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
