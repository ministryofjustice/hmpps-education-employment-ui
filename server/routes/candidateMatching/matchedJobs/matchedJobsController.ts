/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import _ from 'lodash'
import { plainToClass } from 'class-transformer'

import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import { getSessionData, setSessionData } from '../../../utils/session'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import JobViewModel from '../../../viewModels/jobViewModel'
import addressLookup from '../../addressLookup'
import typeOfWorkLookup from '../../../constants/contentLookup/typeOfWork'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import { getBackLocation } from '../../../utils/index'
import logger from '../../../../logger'

export default class MatchedJobsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { page, sort, order, jobSectorFilter = '', locationFilter = '', distanceFilter = '50' } = req.query
    const { userActiveCaseLoad, nationalJobsEnabled } = res.locals
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
        jobSectorFilter && `jobSectorFilter=${decodeURIComponent(jobSectorFilter as string)}`,
        distanceFilter && `distanceFilter=${decodeURIComponent(distanceFilter as string)}`,
        page && `page=${page}`,
        nationalJobsEnabled && `isNationalJob=false`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (matchedJobsResults.page.totalElements) {
        if (matchedJobsResults.page.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPaginationNew(
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
          defaultRoute: addressLookup.workProfile(id, 'overview', 'mjma'),
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
        typeOfWorkOtherOptions: Object.keys(typeOfWorkLookup).filter(p => !workTypesOfInterest.includes(p)),
        locationFilter:
          decodeURIComponent(locationFilter as string) === 'none'
            ? ''
            : decodeURIComponent(locationFilter as string) || postcode,
        jobSectorFilter: _.compact(decodeURIComponent(jobSectorFilter as string).split(',')),
        distanceFilter: decodeURIComponent(distanceFilter as string),
        filtered:
          (decodeURIComponent(locationFilter as string) && decodeURIComponent(locationFilter as string) !== postcode) ||
          !_.isEqual(decodeURIComponent(jobSectorFilter as string).split(','), workTypesOfInterest) ||
          decodeURIComponent(distanceFilter as string) !== '50',
      }

      setSessionData(req, ['matchedJobs', 'data'], data)

      res.render('pages/candidateMatching/matchedJobs/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - Matched jobs')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { sort, order } = req.query
    const { jobSectorFilter = [], jobSectorFilterOther = [], locationFilter, distanceFilter } = req.body
    const { nationalJobsEnabled } = res.locals

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['matchedJobs', 'data'])
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/candidateMatching/matchedJobs/index', {
          ...data,
          errors,
          jobSectorFilter,
          jobSectorFilterOther,
          locationFilter,
          distanceFilter,
        })
        return
      }

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        distanceFilter && `distanceFilter=${encodeURIComponent(distanceFilter)}`,
        (jobSectorFilter.length || jobSectorFilterOther.length) &&
          `jobSectorFilter=${encodeURIComponent([...jobSectorFilter, ...jobSectorFilterOther].join(','))}`,
        `locationFilter=${encodeURIComponent(locationFilter || 'none')}`,
        nationalJobsEnabled && `isNationalJob=false`,
      ].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.candidateMatching.matchedJobs(id)}?${uri.join('&')}`
          : addressLookup.candidateMatching.matchedJobs(id),
      )
    } catch (err) {
      logger.error('Error posting form - Matched jobs')
      next(err)
    }
  }
}
