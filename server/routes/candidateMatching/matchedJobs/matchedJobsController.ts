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
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import { getBackLocation } from '../../../utils/index'

export default class MatchedJobsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { page, sort, order, typeOfWorkFilter = '', locationFilter = '', distanceFilter = '10' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const { prisoner, profile, matchedJobsResults, prisonerAddress } = req.context

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
        distanceFilter && `distanceFilter=${decodeURIComponent(distanceFilter as string)}`,
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

      // Get default release area postcode
      const postcode = _.get(prisonerAddress, 'postcode', '')

      // Render data
      const data = {
        id,
        backLocation: getBackLocation({
          req,
          defaultRoute: addressLookup.workProfile(id, 'overview', 'cms'),
          page: 'matchedJobs',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
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
        locationFilter:
          decodeURIComponent(locationFilter as string) === 'none'
            ? ''
            : decodeURIComponent(locationFilter as string) || postcode,
        typeOfWorkFilter: _.compact(decodeURIComponent(typeOfWorkFilter as string).split(',')),
        distanceFilter: decodeURIComponent(distanceFilter as string),
        filtered:
          decodeURIComponent(locationFilter as string) ||
          decodeURIComponent(typeOfWorkFilter as string) ||
          decodeURIComponent(distanceFilter as string) !== '10',
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
        typeOfWorkFilter &&
          `typeOfWorkFilter=${encodeURIComponent([...typeOfWorkFilter, ...typeOfWorkFilterOther].join(','))}`,
        `locationFilter=${encodeURIComponent(locationFilter || 'none')}`,
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
