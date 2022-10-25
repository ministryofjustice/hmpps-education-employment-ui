import { Router } from 'express'
import cohortListRoutes from './cohortList'
import type { Services } from '../services'
import createProfileRoutes from './createProfile'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })
  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })
  // Append page routes
  cohortListRoutes(router, services)
  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  // Append page routes
  cohortListRoutes(router, services)
  createProfileRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
