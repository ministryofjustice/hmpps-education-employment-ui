import { Router } from 'express'
import type { Services } from '../services'
import cohortListRoutes from './cohortList'
import createProfileRoutes from './createProfile'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })
  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })

  // Append page routes
  cohortListRoutes(router, services)
  createProfileRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
