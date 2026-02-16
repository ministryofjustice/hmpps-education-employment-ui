import { Request, Response, NextFunction } from 'express'
import { encryptUrlParameter } from '../../../utils/index'

// if user lands directly on a deep page without from, the safest logical fallback is:
export const getDefaultBackLink = (req: Request): string => {
  if (req.params?.id && req.params.jobId && req.params?.mode) {
    return `/mjma/${req.params.id}/job/${req.params.jobId}/application/${req.params.mode}`
  }
  if (req.params?.id) {
    return `/mjma/profile/${req.params.id}/view/overview`
  }
  return '/mjma/applications'
}

const getCurrentPathMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const originalUrl = req.originalUrl ?? ''
  const initialUrl = getDefaultBackLink(req)

  // Always expose currentPath
  res.locals.currentPath = originalUrl

  // Extract query params safely
  const [path, queryString] = originalUrl.split('?')
  const params = new URLSearchParams(queryString ?? '')

  // Determine base from value
  const existingFrom = params.get('from')
  const effectiveFrom = existingFrom ?? encryptUrlParameter(initialUrl)

  // Remove any existing `from` to avoid duplication
  params.delete('from')

  // Rebuild current URL without `from`
  const cleanedQuery = params.toString()
  const cleanedUrl = cleanedQuery ? `${path}?${cleanedQuery}` : path

  // Set req.query.from to: originalUrl + '?from=' + effectiveFrom
  const separator = cleanedUrl.includes('?') ? '&' : '?'

  req.query.from = effectiveFrom

  next()
}

export default getCurrentPathMiddleware
