import type { Router } from 'express'

import type { Services } from '../../services'
import prisonerImageRoutes from './prisonerImage'
import featuresEnabledRoutes from './featuresEnabled'

export default (router: Router, services: Services) => {
  prisonerImageRoutes(router, services)
  featuresEnabledRoutes(router)
}
