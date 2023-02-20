/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'
import config from '../../config'

const PRISONER_SEARCH_BY_RELEASE_DATE = '/'

export default class CohortListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, status = '', searchTerm = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const prisonerSearchResults = req.context.cohortList

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        status && status !== 'ALL' && `status=${status}`,
        searchTerm && `searchTerm=${decodeURIComponent(searchTerm as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      const displayName = searchTerm && decodeURIComponent(searchTerm as string)

      // Build pagination or error messages
      if (prisonerSearchResults.totalElements) {
        const { paginationPageSize } = config
        if (prisonerSearchResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          const paginationUrl = new URL(
            `${req.protocol}://${req.get('host')}${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}`,
          )

          paginationData = this.paginationService.getPagination(prisonerSearchResults, paginationUrl)
        }
      } else if (displayName && status) {
        notFoundMsg =
          [
            `0 results for "[${displayName}]" in [${status}]`,
            'Check your spelling and search again, or select another status.',
          ] || ''
      } else if (displayName) {
        notFoundMsg =
          [
            `0 results for "[${displayName}]"`,
            'Check your spelling and search again, or clear the search and browse for the prisoner.',
          ] || ''
      } else {
        notFoundMsg =
          [`0 results in [${status}]`, 'Check your spelling and search again, or search by prisoner name.'] || ''
      }

      // Render data
      const data = {
        prisonerSearchResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
        searchTerm: decodeURIComponent(searchTerm as string),
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
        searchTerm && `searchTerm=${encodeURIComponent(searchTerm)}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}` : PRISONER_SEARCH_BY_RELEASE_DATE)
    } catch (err) {
      next(err)
    }
  }
}
