/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express'
import prisonerListMatchJobs from './prisonerListMatchJobs'
import matchedJobsRoutes from './matchedJobs'
import jobsOfInterestRoutes from './jobsOfInterest'
import archivedJobsRoutes from './archivedJobs'
import jobDetailsRoutes from './jobDetails'
import manageApplicationRoutes from './manageApplication'
import prisonerListApplicationsRoutes from './prisonerListApplications'
import routes from '.'
import { Services } from '../../services'
import config from '../../config'

jest.mock('./prisonerListMatchJobs')
jest.mock('./matchedJobs')
jest.mock('./jobsOfInterest')
jest.mock('./archivedJobs')
jest.mock('./jobDetails')
jest.mock('./manageApplication')
jest.mock('./prisonerListApplications')
jest.mock('express', () => ({
  Router: jest.fn().mockImplementation(() => ({
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe('Server routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = Router() as Router
    ;(Router as any).mockImplementation(() => router)
    services = {} as Services
  })

  it('calls editActionRoutes with router and services', () => {
    routes(router as any, services as any)
    expect(prisonerListMatchJobs).toHaveBeenCalledWith(router, services)
    expect(matchedJobsRoutes).toHaveBeenCalledWith(router, services)
    expect(jobDetailsRoutes).toHaveBeenCalledWith(router, services)

    if (config.featureToggles.expressionsOfInterestEnabled) {
      expect(jobsOfInterestRoutes).toHaveBeenCalledWith(router, services)
    }

    if (config.featureToggles.archiveJobsEnabled) {
      expect(archivedJobsRoutes).toHaveBeenCalledWith(router, services)
    }

    if (config.featureToggles.jobApplicationsEnabled) {
      expect(manageApplicationRoutes).toHaveBeenCalledWith(router, services)
      expect(prisonerListApplicationsRoutes).toHaveBeenCalledWith(router, services)
    }
  })
})
