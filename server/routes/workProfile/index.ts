import express, { Router } from 'express'
import SearchRoutes from './search'
import type { Services } from '../../services'

export default function createRoutes(service: Services): Router {
  const router = express.Router({ mergeParams: true })

  router.get('/work-profile', (req, res) => {
    res.render('pages/workProfile/viewWorkProfile')
  })

  const searchRoute = new SearchRoutes(service.prisonerSearch, service.paginationService)

  router.get('/work-profile/search', searchRoute.prisonerSearch, (req, res) => {
    res.render('pages/workProfile/viewWorkProfile', { searchRoute })
  })
  router.use((req, res) => res.status(404).render('notFoundPage.njk'))
  return router
}
