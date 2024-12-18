import { escape, trim } from 'validator'
import { Request, Response, NextFunction } from 'express'

// Define a whitelist of fields that should not be sanitized
const WHITELIST = ['_csrf']

const sanitizeBody = (req: Request, res: Response, next: NextFunction): void => {
  const sanitizeField = (value: unknown): string => {
    if (typeof value === 'string') {
      return escape(trim(value))
    }
    return value as string
  }

  // Sanitize all fields except those in the whitelist
  Object.keys(req.body).forEach(key => {
    if (!WHITELIST.includes(key)) {
      req.body[key] = sanitizeField(req.body[key])
    }
  })

  next()
}

export default sanitizeBody
