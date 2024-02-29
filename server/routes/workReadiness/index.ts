import { Router } from 'express'
import type { Services } from '../../services'
import workProfileRoutes from './workProfile'
import cohortListRoutes from './cohortList'
import createProfileRoutes from './createProfile'
import changeStatusRoutes from './changeStatus'
import actionsRoutes from './actions'

export default function routes(router: Router, services: Services): void {
  cohortListRoutes(router, services)
  workProfileRoutes(router, services)
  createProfileRoutes(router, services)
  changeStatusRoutes(router, services)
  actionsRoutes(router, services)
}
