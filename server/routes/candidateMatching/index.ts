import { Router } from 'express'
import type { Services } from '../../services'
import prisonerListMatchJobsRoutes from './prisonerListMatchJobs'
import matchedJobsRoutes from './matchedJobs'
import flaggedJobsRoutes from './flaggedJobs'
import archivedJobsRoutes from './archivedJobs'
import jobDetailsRoutes from './jobDetails'
import manageApplicationRoutes from './manageApplication'
import prisonerListApplicationsRoutes from './prisonerListApplications'

export default function attachRoutes(router: Router, services: Services): void {
  prisonerListMatchJobsRoutes(router, services)
  matchedJobsRoutes(router, services)
  flaggedJobsRoutes(router, services)
  archivedJobsRoutes(router, services)
  jobDetailsRoutes(router, services)
  manageApplicationRoutes(router, services)
  prisonerListApplicationsRoutes(router, services)
}
