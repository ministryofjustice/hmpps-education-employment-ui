import { type RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonSearchService'

const checkPrisonerInActiveCaseLoad =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { userActiveCaseLoad, username } = res.locals

    // default: allowed
    res.locals.profileViewNotAllowed = false

    try {
      const searchByPrisonIdResponse = await prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId(
        username,
        userActiveCaseLoad.caseLoadId,
        id,
      )
      if (searchByPrisonIdResponse.empty) {
        res.locals.profileViewNotAllowed = true
      }
    } catch (err) {
      res.locals.profileViewNotAllowed = true
    }
    next()
  }

export default checkPrisonerInActiveCaseLoad
