/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'
import PrisonerSearchResult from '../../data/prisonerSearch/prisonerSearchResult'
import PagedResponse from '../../data/domain/types/pagedResponse'

const PRISONER_SEARCH_BY_RELEASE_DATE = '/work-profile/cohort-list'

export default class CohortListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, status = '', lastName = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    let prisonerSearchResults = req.context.cohortList

    try {
      const searchFilter = [status && `${status}`, lastName && `${decodeURIComponent(lastName.toString())}`]
      const filter = searchFilter && searchFilter.join(',')

      // Filter result set if required
      if (filter.length > 1) {
        const filteredResults: PagedResponse<PrisonerSearchResult[]> =
          await this.prisonerSearchService.filterOffenderProfiles(req.context.cohortList, filter.toString())
        prisonerSearchResults = filteredResults as any
      }

      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        status && status !== 'ALL' && `status=${status}`,
        lastName && `lastName=${decodeURIComponent(lastName as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      if (prisonerSearchResults.totalElements) {
        const paginationUrl = new URL(`${req.protocol}://${req.get('host')}${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri}`)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paginationData = this.paginationService.getPagination(prisonerSearchResults, paginationUrl)
      } else {
        const arrSearchCriteria = []
        arrSearchCriteria.push(lastName && ` Lastname = ${lastName}`)
        arrSearchCriteria.push(status && ` Status = ${status}`)
        notFoundMsg =
          (arrSearchCriteria.length && [
            `0 results for [${arrSearchCriteria.toString()}]`,
            'Check your spelling and search again, or clear the search and browse for the prisoner.',
          ]) ||
          ''
      }

      // Render data
      const data = {
        prisonerSearchResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
        lastName: `${decodeURIComponent(lastName as string)}`,
        filterStatus: status || 'ALL',
      }
      res.render('pages/cohortList/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order } = req.query
    const { selectStatus, searchTerm } = req.body

    try {
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        selectStatus && `status=${selectStatus}`,
        searchTerm && `lastName=${encodeURIComponent(searchTerm)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}` : PRISONER_SEARCH_BY_RELEASE_DATE)
    } catch (err) {
      next(err)
    }
  }
}
