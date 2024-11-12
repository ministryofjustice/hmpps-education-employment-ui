/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import { getSessionData } from '../../../utils/session'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'

export default class PrisonerListMatchJobsController {
  constructor(private readonly paginationService: PaginationService) {}

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
            new URL(
              `${req.protocol}://${req.get(
                'host',
              )}${addressLookup.candidateMatching.prisonerListMatchJobs()}?${uri.join('&')}`,
            ),
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

      res.render('pages/candidateMatching/prisonerListMatchJobs/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Prisioner list match jobs')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { typeOfWorkFilter, prisonerNameFilter, showNeedsSupportFilter } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['prisonerListMatchJobs', 'data'])
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/candidateMatching/prisonerListMatchJobs/index', {
          ...data,
          errors,
          ...req.body,
        })
        return
      }

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        showNeedsSupportFilter && `showNeedsSupportFilter=true`,
        prisonerNameFilter && `prisonerNameFilter=${encodeURIComponent(prisonerNameFilter)}`,
        typeOfWorkFilter && `typeOfWorkFilter=${encodeURIComponent(typeOfWorkFilter)}`,
      ].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.candidateMatching.prisonerListMatchJobs()}?${uri.join('&')}`
          : addressLookup.candidateMatching.prisonerListMatchJobs(),
      )
    } catch (err) {
      logger.error('Error posting form - Prisioner list match jobs')
      next(err)
    }
  }
}
