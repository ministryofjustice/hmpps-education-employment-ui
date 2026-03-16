import { Request, Response, NextFunction } from 'express'
import { navigationService } from '../services/navigationService'

const navigationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.backLink = navigationService.getBackLink(req.originalUrl)

  res.locals.withFrom = (targetUrl: string) => navigationService.appendFromParam(targetUrl, req.originalUrl)

  next()
}
export default navigationMiddleware
