/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction } from 'express'

declare global {
  namespace Express {
    interface Request {
      context: {
        [key: string]: any
      }
    }

    interface Response {
      context: {
        [key: string]: any
      }
    }
  }
}

const expressContext = () => (req: Express.Request, res: Express.Response, next: NextFunction) => {
  req.context = {}
  res.context = {}
  next()
}

export default expressContext
