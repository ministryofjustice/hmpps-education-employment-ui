import { Router } from 'express'
import type { Services } from '../../services'
import prisonerListMatchJobsRoutes from './prisonerListMatchJobs'
import matchedJobsRoutes from './matchedJobs'
import jobsOfInterestRoutes from './jobsOfInterest'
import archivedJobsRoutes from './archivedJobs'
import jobDetailsRoutes from './jobDetails'
import manageApplicationRoutes from './manageApplication'
import prisonerListApplicationsRoutes from './prisonerListApplications'
import config from '../../config'

export default function attachRoutes(router: Router, services: Services): void {
  prisonerListMatchJobsRoutes(router, services)
  matchedJobsRoutes(router, services)
  jobDetailsRoutes(router, services)

  if (config.featureToggles.expressionsOfInterestEnabled) {
    jobsOfInterestRoutes(router, services)
  }

  if (config.featureToggles.archiveJobsEnabled) {
    archivedJobsRoutes(router, services)
  }

  if (config.featureToggles.jobApplicationsEnabled) {
    manageApplicationRoutes(router, services)
    prisonerListApplicationsRoutes(router, services)
  }
}
