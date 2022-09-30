import type { RequestHandler } from 'express'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'
import { twelveWeeksFromNow, formatDateToyyyyMMdd } from '../../utils/utils'

const PRISONER_SEARCH_BY_RELEASE_DATE = '/work-profile/releaseByDate'

export default class CohortListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res): Promise<void> => {
    const { page } = req.query
    const pageNumber = page ? +page - 1 : 0
    const dateFilter = `${twelveWeeksFromNow()},${formatDateToyyyyMMdd(new Date().toString())}`
    const userCaseLoad = await this.prisonerSearchService.getUserPrisonCaseloads(res.locals.user, res.locals.user.token)

    const results = await this.prisonerSearchService.searchByReleaseDate(
      res.locals.user.username,
      dateFilter,
      userCaseLoad,
      res.locals.user.token,
      pageNumber,
    )
    const paginationUrl = new URL(`${req.protocol}://${req.get('host')}${PRISONER_SEARCH_BY_RELEASE_DATE}`)
    const paginationData = this.paginationService.getPagination(results, paginationUrl)

    res.render('pages/workProfile/viewWorkProfile', { prisonerSearchResults: results, paginationData })
  }
}
