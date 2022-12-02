import type { Router } from 'express'

import type { Services } from '../../services'
import newStatusRoutes from './newStatus'

export default (router: Router, services: Services) => {
  newStatusRoutes(router, services)
}
