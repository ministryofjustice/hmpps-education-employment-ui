import { type RequestHandler, Router } from 'express'

import createProfileRoutes from './createProfile'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })

  router.get('/', (req, res, next) => {
    res.render('pages/index')
  })

  // Append page routes
  createProfileRoutes(router, services)

  router.use((req, res) => res.status(404).render('notFoundPage.njk'))

  return router
}
