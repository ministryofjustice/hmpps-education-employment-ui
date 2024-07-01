import { Router } from 'express'
import type { Services } from '../../services'
import prisonerListMatchJobsRoutes from './prisonerListMatchJobs'
import matchedJobsRoutes from './matchedJobs'
import jobsOfInterestRoutes from './jobsOfInterest'
import archivedJobsRoutes from './archivedJobs'
import jobDetailsRoutes from './jobDetails'
import manageApplicationRoutes from './manageApplication'
import prisonerListApplicationsRoutes from './prisonerListApplications'

export default function attachRoutes(router: Router, services: Services): void {
  prisonerListMatchJobsRoutes(router, services)
  matchedJobsRoutes(router, services)
  jobsOfInterestRoutes(router, services)
  archivedJobsRoutes(router, services)
  jobDetailsRoutes(router, services)
  manageApplicationRoutes(router, services)
  prisonerListApplicationsRoutes(router, services)
}
