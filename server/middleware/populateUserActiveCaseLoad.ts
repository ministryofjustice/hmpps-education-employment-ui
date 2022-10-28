import { RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonSearchService'

export default function populateUserActiveCaseLoad(prisonerSearchService: PrisonerSearchService): RequestHandler {
  return async (req, res, next) => {
    try {
      const userActiveCaseLoad: any = await prisonerSearchService.getUserActiveCaseLoad(
        res.locals.user,
        res.locals.user.token,
      )

      res.locals.userActiveCaseLoad = userActiveCaseLoad

      next()
    } catch (err) {
      next(err)
    }
  }
}
