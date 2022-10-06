import type { Router } from 'express'

import type { Services } from '../../services'
import rightToWorkRoutes from './rightToWork'
import ineligableToWorkRoutes from './ineligableToWork'

export default (router: Router, services: Services) => {
  rightToWorkRoutes(router, services)
  ineligableToWorkRoutes(router, services)
}
