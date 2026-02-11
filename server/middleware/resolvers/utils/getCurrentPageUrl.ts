import { Request, Response, NextFunction } from 'express'

const DEFAULT_RETURN_URL = ''

const getCurrentPathMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const originalUrl = req.originalUrl ?? ''

  // Always expose currentPath
  res.locals.currentPath = originalUrl

  // Extract query params safely
  const [path, queryString] = originalUrl.split('?')
  const params = new URLSearchParams(queryString ?? '')

  // Derive `from`
  const from = params?.get('from') // ?? res.locals.from ?? encryptUrlParameter(originalUrl)

  // Back link precedence:
  // 1. explicit ?from=
  // 2. fallback
  res.locals.backLink = from ?? DEFAULT_RETURN_URL

  // Remove `from` so currentPath is clean
  params.delete('from')

  // Pass it forward automatically
  const remainingQuery = params.toString()
  res.locals.currentPath = remainingQuery ? `${path}?${remainingQuery}` : path

  next()
}

export default getCurrentPathMiddleware
