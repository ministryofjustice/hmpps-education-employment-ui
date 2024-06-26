import { Router } from 'express'
import type { Services } from '../services'
import workProfileRoutes from './workProfile'
import cohortListRoutes from './cohortList'
import createProfileRoutes from './createProfile'
import changeStatusRoutes from './changeStatus'
import actionsRoutes from './actions'
import accessibilityStatementRoutes from './accessibilityStatement'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })

  // Append page routes
  cohortListRoutes(router, services)
  workProfileRoutes(router, services)
  createProfileRoutes(router, services)
  changeStatusRoutes(router, services)
  actionsRoutes(router, services)
  accessibilityStatementRoutes(router)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
