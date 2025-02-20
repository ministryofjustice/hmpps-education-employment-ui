/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import { getSessionData, setSessionData } from '../../../utils/session'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../addressLookup'
import logger from '../../../../logger'

export default class PrisonerListApplicationsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, applicationStatusFilter = '', prisonerNameFilter = '', jobFilter = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const prisonerSearchResults = req.context.prisonerListApplications

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobFilter && `prisonerNameFilter=${decodeURIComponent(jobFilter as string)}`,
        prisonerNameFilter && `prisonerNameFilter=${decodeURIComponent(prisonerNameFilter as string)}`,
        applicationStatusFilter && `applicationStatusFilter=${decodeURIComponent(applicationStatusFilter as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (prisonerSearchResults.page.totalElements) {
        if (prisonerSearchResults.page.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPaginationNew(
            prisonerSearchResults,
            new URL(
              `${req.protocol}://${req.get(
                'host',
              )}${addressLookup.candidateMatching.prisonerListApplications()}?${uri.join('&')}`,
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
        applicationStatusFilter: decodeURIComponent(applicationStatusFilter as string),
        jobFilter: decodeURIComponent(jobFilter as string),
        filtered:
          decodeURIComponent(prisonerNameFilter as string) ||
          decodeURIComponent(applicationStatusFilter as string) ||
          decodeURIComponent(jobFilter as string),
      }

      setSessionData(req, ['prisonerListApplications', 'data'], data)

      res.render('pages/candidateMatching/prisonerListApplications/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Prisioner list applications')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { applicationStatusFilter, prisonerNameFilter, jobFilter } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['prisonerListApplications', 'data'])
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/candidateMatching/prisonerListApplications/index', {
          ...data,
          errors,
          ...req.body,
        })
        return
      }

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobFilter && `jobFilter=${encodeURIComponent(jobFilter)}`,
        prisonerNameFilter && `prisonerNameFilter=${encodeURIComponent(prisonerNameFilter)}`,
        applicationStatusFilter && `applicationStatusFilter=${encodeURIComponent(applicationStatusFilter)}`,
      ].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.candidateMatching.prisonerListApplications()}?${uri.join('&')}`
          : addressLookup.candidateMatching.prisonerListApplications(),
      )
    } catch (err) {
      logger.error('Error posting form - Prisioner list applications')
      next(err)
    }
  }
}
