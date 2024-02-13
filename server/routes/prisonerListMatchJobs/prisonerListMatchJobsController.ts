/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'
import config from '../../config'

const PRISONER_SEARCH_BY_RELEASE_DATE = '/cms/prisoners'

export default class PrisonerListMatchJobsController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, typeOfWorkFilter = '', prisonerNameFilter = '', showNeedsSupportFilter = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const prisonerSearchResults = req.context.prisonerListMatchedJobs

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        prisonerNameFilter && `prisonerNameFilter=${decodeURIComponent(prisonerNameFilter as string)}`,
        typeOfWorkFilter && `typeOfWorkFilter=${decodeURIComponent(typeOfWorkFilter as string)}`,
        showNeedsSupportFilter && showNeedsSupportFilter !== '' && `showNeedsSupportFilter=true`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (prisonerSearchResults.totalElements) {
        if (prisonerSearchResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            prisonerSearchResults,
            new URL(`${req.protocol}://${req.get('host')}${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}`),
          )
        }
      }

      // Render data
      const data = {
        prisonerSearchResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
        prisonerNameFilter: decodeURIComponent(prisonerNameFilter as string),
        typeOfWorkFilter: decodeURIComponent(typeOfWorkFilter as string),
        showNeedsSupportFilter: decodeURIComponent(showNeedsSupportFilter as string) === 'true',
        filtered:
          decodeURIComponent(prisonerNameFilter as string) ||
          decodeURIComponent(typeOfWorkFilter as string) ||
          decodeURIComponent(showNeedsSupportFilter as string),
      }

      res.render('pages/prisonerListMatchJobs/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { typeOfWorkFilter, prisonerNameFilter, showNeedsSupportFilter } = req.body

    try {
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        showNeedsSupportFilter && `showNeedsSupportFilter=true`,
        prisonerNameFilter && `prisonerNameFilter=${encodeURIComponent(prisonerNameFilter)}`,
        typeOfWorkFilter && `typeOfWorkFilter=${encodeURIComponent(typeOfWorkFilter)}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${PRISONER_SEARCH_BY_RELEASE_DATE}?${uri.join('&')}` : PRISONER_SEARCH_BY_RELEASE_DATE)
    } catch (err) {
      next(err)
    }
  }
}
