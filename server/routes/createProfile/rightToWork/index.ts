import type { Router } from 'express'

import type { Services } from '../../../services'
import RightToWorkController from './RightToWorkController'

export default (router: Router, services: Services) => {
  const controller = new RightToWorkController()

  router.get('/work-profile/create/:id/right-to-work/:mode', controller.get)
  router.post('/work-profile/create/:id/right-to-work/:mode', controller.post)
}
