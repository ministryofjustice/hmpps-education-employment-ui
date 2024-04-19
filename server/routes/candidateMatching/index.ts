import { Router } from 'express'
import type { Services } from '../../services'
import prisonerListMatchJobsRoutes from './prisonerListMatchJobs'
import matchedJobsRoutes from './matchedJobs'
import flaggedJobsRoutes from './flaggedJobs'

export default function attachRoutes(router: Router, services: Services): void {
  prisonerListMatchJobsRoutes(router, services)
  matchedJobsRoutes(router, services)
  flaggedJobsRoutes(router, services)
}
