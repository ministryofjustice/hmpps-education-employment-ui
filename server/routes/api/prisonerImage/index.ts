import { Router } from 'express'
import type { Services } from '../../../services'
import PrisonerImageHandler from './prisonerImageHandler'

export default function routes(router: Router, services: Services): void {
  const handler = new PrisonerImageHandler(services.prisonService)

  router.get('/api/prisoner-image/:id', handler.get)
}
