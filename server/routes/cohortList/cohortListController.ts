import { RequestHandler } from 'express'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'
// eslint-disable-next-line import/named
import { buildPostUrl, formatDateToyyyyMMdd, offenderEarliestReleaseDate } from '../../utils/utils'
import config from '../../config'
import PagedResponse from '../../data/domain/types/pagedResponse'

const PRISONER_SEARCH_BY_RELEASE_DATE = '/work-profile/cohort-list'

export default class CohortListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res): Promise<void> => {
    const { page, sort, order, status, lastName } = req.query
    const pageNumber = page ? +page - 1 : 0

    const searchFilter = [status && `${status}`, lastName && `${lastName}`]
    const filter = searchFilter && searchFilter.join(',')

    const { weeksBeforeRelease } = config
    const dateFilter = `${formatDateToyyyyMMdd(new Date().toString())}, ${offenderEarliestReleaseDate(
      weeksBeforeRelease,
    )}`

    const userCaseLoad = await this.prisonerSearchService.getUserPrisonCaseloads(res.locals.user, res.locals.user.token)

    const results = await this.prisonerSearchService.searchByReleaseDateRaw(
      res.locals.user.username,
      dateFilter,
      userCaseLoad,
      res.locals.user.token,
      sort,
      order,
      filter,
      pageNumber,
    )

    // TODO: implement pagination
    // const uri = buildPostUrl([sortParamFilter, filter], PRISONER_SEARCH_BY_RELEASE_DATE)
    const paginationUrl = new URL(
      `${req.protocol}://${req.get('host')}${PRISONER_SEARCH_BY_RELEASE_DATE}?page=${pageNumber}`,
    )
    const paginationData = this.paginationService.getPagination(results as unknown as PagedResponse<any>, paginationUrl)

    const data = {
      prisonerSearchResults: results,
      sort,
      order,
      paginationData,
    }
    res.render('pages/cohortList/index', { ...data })
  }

  public post: RequestHandler = async (req, res): Promise<void> => {
    const { page, sort, order } = req.query
    const { selectStatus, search } = req.body
    const uri = buildPostUrl([sort, order, selectStatus, search, page], PRISONER_SEARCH_BY_RELEASE_DATE)

    // req.body.postUrl = postUrl
    res.redirect(uri.toString())
  }
}
