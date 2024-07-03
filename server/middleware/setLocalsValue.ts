import type { RequestHandler } from 'express'

// Set value in locals
const setLocalsValue =
  (key: string, value: unknown): RequestHandler =>
  async (req, res, next): Promise<void> => {
    res.locals[key] = value

    next()
  }

export default setLocalsValue
