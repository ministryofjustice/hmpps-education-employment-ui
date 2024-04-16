import { Router } from 'express'
import type { Services } from '../../services'
import prisonerListMatchJobsRoutes from './prisonerListMatchJobs'
import matchedJobs from './matchedJobs'

export default function attachRoutes(router: Router, services: Services): void {
  prisonerListMatchJobsRoutes(router, services)
  matchedJobs(router, services)
}
