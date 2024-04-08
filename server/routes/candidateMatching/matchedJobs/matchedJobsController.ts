/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import { getSessionData } from '../../../utils/session'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'

const MATCHED_JOBS = '/cms/jobs/matched'

export default class MatchedJobsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, typeOfWorkFilter = '', locationFilter = '', distanceFilter = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const { matchedJobsResults } = req.context

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        locationFilter && `locationFilter=${decodeURIComponent(locationFilter as string)}`,
        typeOfWorkFilter && `typeOfWorkFilter=${decodeURIComponent(typeOfWorkFilter as string)}`,
        distanceFilter && distanceFilter !== '' && `distanceFilter=true`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (matchedJobsResults.totalElements) {
        if (matchedJobsResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            matchedJobsResults,
            new URL(`${req.protocol}://${req.get('host')}${MATCHED_JOBS}?${uri.join('&')}`),
          )
        }
      }

      // Render data
      const data = {
        matchedJobsResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
        locationFilter: decodeURIComponent(locationFilter as string),
        typeOfWorkFilter: decodeURIComponent(typeOfWorkFilter as string),
        distanceFilter: decodeURIComponent(distanceFilter as string) === 'true',
        filtered:
          decodeURIComponent(locationFilter as string) ||
          decodeURIComponent(typeOfWorkFilter as string) ||
          decodeURIComponent(distanceFilter as string),
      }

      res.render('pages/candidateMatching/matchedJobs/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { typeOfWorkFilter, locationFilter, distanceFilter } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['ciagList', 'data'])
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/candidateMatching/matchedJobs/index', {
          ...data,
          errors,
          ...req.body,
        })
        return
      }

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        distanceFilter && `distanceFilter=true`,
        locationFilter && `locationFilter=${encodeURIComponent(locationFilter)}`,
        typeOfWorkFilter && `typeOfWorkFilter=${encodeURIComponent(typeOfWorkFilter)}`,
      ].filter(val => !!val)

      res.redirect(uri.length ? `${MATCHED_JOBS}?${uri.join('&')}` : MATCHED_JOBS)
    } catch (err) {
      next(err)
    }
  }
}
