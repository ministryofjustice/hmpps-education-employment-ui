import { Router } from 'express'
import type { Services } from '../services'
import workReadinessRoutes from './workReadiness'
import accessibilityStatementRoutes from './accessibilityStatement'
import candidateMatchingRoutes from './candidateMatching'
import homePageRoutes from './homePage'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })

  // Append page routes
  homePageRoutes(router, services)
  accessibilityStatementRoutes(router)

  // Work readiness routes
  workReadinessRoutes(router, services)

  // Candidate matching routes
  candidateMatchingRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
