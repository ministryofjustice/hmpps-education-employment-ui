/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'
import { formatDateToyyyyMMdd, offenderEarliestReleaseDate } from '../../utils/utils'
import config from '../../config'

const PRISONER_SEARCH_BY_RELEASE_DATE = '/work-profile/cohort-list'

export default class CohortListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res): Promise<void> => {
    const { page, sort, order, status = '', lastName = '' } = req.query
    const pageNumber = page ? +page - 1 : 0

    const searchFilter = [status && `${status}`, lastName && `${decodeURIComponent(lastName.toString())}`]
    const filter = searchFilter && searchFilter.join(',')

    const { weeksBeforeRelease } = config
    const dateFilter = `${formatDateToyyyyMMdd(new Date().toString())}, ${offenderEarliestReleaseDate(
      weeksBeforeRelease,
    )}`

    const userActiveCaseLoad: any = await this.prisonerSearchService.getUserActiveCaseLoad(
      res.locals.user,
      res.locals.user.token,
    )

    const results = await this.prisonerSearchService.searchByReleaseDateRaw(
      res.locals.user.username,
      dateFilter,
      [userActiveCaseLoad.caseLoadId],
      res.locals.user.token,
      sort,
      order,
      filter.length === 1 ? '' : filter,
      pageNumber,
    )

    // Paginate where necessary
    const arrSearchCriteria = []
    arrSearchCriteria.push(lastName && ` Lastname = ${lastName}`)
    arrSearchCriteria.push(status && ` Status = ${status}`)
    const notFoundMsg = arrSearchCriteria.length && [
      `0 results for [${arrSearchCriteria.toString()}]`,
      'Check your spelling and search again, or clear the search and browse for the prisoner.',
    ]

    let paginationData = {}
    if ((results as any).content.length) {
      const paginationUrl = new URL(
        `${req.protocol}://${req.get('host')}${PRISONER_SEARCH_BY_RELEASE_DATE}?page=${pageNumber}`,
      )

      paginationData = this.paginationService.getPagination(results as any, paginationUrl)
    }

    const data = {
      prisonerSearchResults: results,
      sort,
      order,
      paginationData,
      userActiveCaseLoad,
      notFoundMsg,
      lastName: `${decodeURIComponent(lastName as string)}`,
    }
    res.render('pages/cohortList/index', { ...data })
  }

  public post: RequestHandler = async (req, res): Promise<void> => {
    const { page, sort, order } = req.query
    const { selectStatus, searchTerm } = req.body

    const uri = [
      sort && `sort=${sort}`,
      order && `order=${order}`,
      selectStatus && selectStatus !== 'ALL' && `status=${selectStatus}`,
      searchTerm && `lastName=${encodeURIComponent(searchTerm)}`,
      page && `page=${page}`,
    ].filter(val => !!val)

    res.redirect(uri.length ? `${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}` : PRISONER_SEARCH_BY_RELEASE_DATE)
  }
}
