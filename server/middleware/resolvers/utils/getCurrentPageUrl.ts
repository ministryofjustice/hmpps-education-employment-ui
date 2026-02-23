import { NextFunction, Request, Response } from 'express'
import { encryptUrlParameter } from '../../../utils/urlParameterEncryption'
import JourneyTypeValue from '../../../enums/journeyTypeValue'

// if user lands directly on a deep page without from, the safest logical fallback is:
export const getDefaultBackLink = (req: Request, urlFrom?: JourneyTypeValue): string => {
  switch (urlFrom) {
    case JourneyTypeValue.JOB_DETAILS:
      return `/mjma/${req.params.id}/job/${req.params.jobId}/details`

    case JourneyTypeValue.MATCHED_JOBS:
      return `/mjma/profile/${req.params.id}/view/overview`

    case JourneyTypeValue.MANAGED_APPLICATIONS:
      return `/mjma/${req.params.id}/job/${req.params.jobId}/application/${req.params.mode}`

    case JourneyTypeValue.VIEW_APPLICATION:
      if (req.params?.id && req.params?.jobId) {
        return `/mjma/${req.params.id}/job/${req.params.jobId}/details`
      }
      return `/mjma/applications?sort=prisonerName&order=ascending`

    default:
      return '/mjma/prisoners?sort=releaseDate&order=ascending'
  }
}

const getCurrentPathMiddleware =
  (sourceUrl?: JourneyTypeValue) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const originalUrl = req.originalUrl ?? ''
    const backLinkUrl = getDefaultBackLink(req, sourceUrl)

    // Always expose currentPath
    res.locals.currentPath = originalUrl

    // Extract query params safely
    const [, queryString] = originalUrl.split('?')
    const params = new URLSearchParams(queryString ?? '')

    const existingFrom = params.get('from')
    const effectiveFrom = existingFrom ?? encryptUrlParameter(backLinkUrl)

    req.query.from = effectiveFrom

    next()
  }

export default getCurrentPathMiddleware
