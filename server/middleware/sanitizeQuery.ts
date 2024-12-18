import { escape, trim } from 'validator'
import { Request, Response, NextFunction } from 'express'

// Define a whitelist of query string parameters that should not be sanitized
const WHITELIST = ['from']

const sanitizeQuery = (req: Request, res: Response, next: NextFunction): void => {
  const sanitizeField = (value: unknown): string => {
    if (typeof value === 'string') {
      return escape(trim(value))
    }
    return value as string
  }

  // Sanitize all query parameters except those in the whitelist
  Object.keys(req.query).forEach(key => {
    if (!WHITELIST.includes(key)) {
      req.query[key] = sanitizeField(req.query[key])
    }
  })

  next()
}

export default sanitizeQuery
