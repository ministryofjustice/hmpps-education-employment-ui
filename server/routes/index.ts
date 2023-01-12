import { Router } from 'express'
import type { Services } from '../services'
import workProfileRoutes from './workProfile'
import cohortListRoutes from './cohortList'
import createProfileRoutes from './createProfile'
import changeStatusRoutes from './changeStatus'
import actionsRoutes from './actions'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })
  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })

  // Append page routes
  workProfileRoutes(router, services)
  cohortListRoutes(router, services)
  createProfileRoutes(router, services)
  changeStatusRoutes(router, services)
  actionsRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
