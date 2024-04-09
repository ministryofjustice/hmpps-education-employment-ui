/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import _ from 'lodash'
import { plainToClass } from 'class-transformer'

import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import { getSessionData } from '../../../utils/session'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import JobViewModel from '../../../viewModels/jobViewModel'
import addressLookup from '../../addressLookup'
import typeOfWorkLookup from '../../../constants/contentLookup/typeOfWork'

export default class MatchedJobsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { page, sort, order, typeOfWorkFilter = '', locationFilter = '', distanceFilter = '10' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const { profile, matchedJobsResults } = req.context

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
        distanceFilter && distanceFilter !== '' && `distanceFilter=${decodeURIComponent(distanceFilter as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (matchedJobsResults.totalElements) {
        if (matchedJobsResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            matchedJobsResults,
            new URL(
              `${req.protocol}://${req.get('host')}${addressLookup.candidateMatching.matchedJobs(id)}?${uri.join('&')}`,
            ),
          )
        }
      }

      // Transform jobs to View Model
      matchedJobsResults.content = plainToClass(JobViewModel, _.get(matchedJobsResults, 'content', []))

      // Get type of work interested in
      const workTypesOfInterest = _.get(profile, 'profileData.supportAccepted.workInterests.workTypesOfInterest', [])

      // Render data
      const data = {
        profile,
        matchedJobsResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
        typeOfWorkOptions: workTypesOfInterest,
        typeOfWorkOtherOptions: Object.keys(typeOfWorkLookup).filter(
          p => !workTypesOfInterest.includes(p) && p !== 'OTHER',
        ),
        locationFilter: decodeURIComponent(locationFilter as string),
        typeOfWorkFilter: decodeURIComponent(typeOfWorkFilter as string),
        distanceFilter: decodeURIComponent(distanceFilter as string),
      }

      res.render('pages/candidateMatching/matchedJobs/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { sort, order } = req.query
    const { typeOfWorkFilter = [], typeOfWorkFilterOther = [], locationFilter, distanceFilter } = req.body

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
        distanceFilter && `distanceFilter=${encodeURIComponent(distanceFilter)}`,
        locationFilter && `locationFilter=${encodeURIComponent(locationFilter)}`,
        typeOfWorkFilter &&
          `typeOfWorkFilter=${encodeURIComponent([...typeOfWorkFilter, ...typeOfWorkFilterOther].join(','))}`,
      ].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.candidateMatching.matchedJobs(id)}?${uri.join('&')}`
          : addressLookup.candidateMatching.matchedJobs(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
