import type { Router } from 'express'

import type { Services } from '../../services'
import editActionRoutes from './editAction'

export default (router: Router, services: Services) => {
  editActionRoutes(router, services)
}
