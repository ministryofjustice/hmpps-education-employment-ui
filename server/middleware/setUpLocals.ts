import { Router } from 'express'
import contentLookup from '../constants/contentLookup'
import addressLookup from '../routes/addressLookup'
import config from '../config'

// Add constants and utilities to locals
export default function setUpLocals(): Router {
  const router = Router({ mergeParams: true })

  router.use((req, res, next) => {
    res.locals.addressLookup = addressLookup
    res.locals.contentLookup = contentLookup
    res.locals.originalUrl = req.originalUrl
    res.locals.manageDetailsLink = `${config.apis.hmppsAuth.externalUrl}/account-details`
    res.locals.candidateMatchingEnabled = config.featureToggles.candidateMatchingEnabled
    res.locals.archiveJobsEnabled = config.featureToggles.archiveJobsEnabled
    res.locals.expressionsOfInterestEnabled = config.featureToggles.expressionsOfInterestEnabled
    res.locals.toggleArchiveJobsEnabled = config.featureToggles.toggleArchiveJobsEnabled
    res.locals.toggleExpressionsOfInterestEnabled = config.featureToggles.toggleExpressionsOfInterestEnabled
    res.locals.jobApplicationsEnabled = config.featureToggles.jobApplicationsEnabled
    res.locals.frontendComponentsEnabled = config.featureToggles.frontendComponentsEnabled
    next()
  })

  return router
}
