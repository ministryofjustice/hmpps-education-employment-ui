import type { Router } from 'express'

import type { Services } from '../../services'
import prisonerImageRoutes from './prisonerImage'

export default (router: Router, services: Services) => {
  prisonerImageRoutes(router, services)
}
