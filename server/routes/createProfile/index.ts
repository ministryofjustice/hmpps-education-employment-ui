import type { Router } from 'express'
import type { Services } from '../../services'

import rightToWorkRoutes from './rightToWork'

export default (router: Router, services: Services) => {
  rightToWorkRoutes(router, services)
}
