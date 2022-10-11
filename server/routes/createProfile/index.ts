import type { Router } from 'express'

import type { Services } from '../../services'
import rightToWorkRoutes from './rightToWork'
import ineligableToWorkRoutes from './ineligableToWork'
import supportOptInRoutes from './supportOptIn'

export default (router: Router, services: Services) => {
  rightToWorkRoutes(router, services)
  ineligableToWorkRoutes(router, services)
  supportOptInRoutes(router, services)
}
