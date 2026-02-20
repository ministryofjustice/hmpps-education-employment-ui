import { type RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonSearchService'

const checkPrisonerInActiveCaseLoad =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { userActiveCaseLoad, username } = res.locals

    try {
      const searchByPrisonIdResponse = await prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId(
        username,
        userActiveCaseLoad.caseLoadId,
        id,
      )
      if (searchByPrisonIdResponse.empty) {
        res.status(404).render('notFoundPage.njk')
        return
      }
    } catch (err) {
      res.status(404).render('notFoundPage.njk')
      return
    }
    next()
  }

export default checkPrisonerInActiveCaseLoad
