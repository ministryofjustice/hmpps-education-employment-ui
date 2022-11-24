/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'

const PRISONER_SEARCH_BY_RELEASE_DATE = '/work-profile/cohort-list'

export default class CohortListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, status = '', lastName = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const prisonerSearchResults = req.context.cohortList

    try {
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
    const { sort, order } = req.query
    const { selectStatus, searchTerm } = req.body

    try {
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        selectStatus && selectStatus !== 'ALL' && `status=${selectStatus}`,
        searchTerm && `lastName=${encodeURIComponent(searchTerm)}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}` : PRISONER_SEARCH_BY_RELEASE_DATE)
    } catch (err) {
      next(err)
    }
  }
}
