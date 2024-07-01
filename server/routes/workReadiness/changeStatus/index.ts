import type { Router } from 'express'

import type { Services } from '../../../services'
import newStatusRoutes from './newStatus'
import newStatusPauseRoutes from './newStatusPause'

export default (router: Router, services: Services) => {
  newStatusRoutes(router, services)
  newStatusPauseRoutes(router, services)
}
