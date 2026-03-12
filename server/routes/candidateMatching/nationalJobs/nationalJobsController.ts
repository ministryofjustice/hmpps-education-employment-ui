/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import _ from 'lodash'
import { plainToInstance } from 'class-transformer'

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
import excludingOffences from '../../../enums/excludingOffences'

export default class NationalJobsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const {
      page,
      sort,
      order,
      jobSectorFilter = '',
      jobSectorFilterOther = '',
      employerFilter = '',
      offenceFilter = '',
    } = req.query
    const { userActiveCaseLoad, offenceFilterEnabled } = res.locals
    const { paginationPageSize } = config
    const { prisoner, profile, nationalJobsResults, nationalEmployersList } = req.context

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobSectorFilter && `jobSectorFilter=${decodeURIComponent(jobSectorFilter as string)}`,
        jobSectorFilterOther && `jobSectorFilterOther=${decodeURIComponent(jobSectorFilterOther as string)}`,
        employerFilter && `employerFilter=${decodeURIComponent(employerFilter as string)}`,
        offenceFilterEnabled && `offenceFilter=${decodeURIComponent(offenceFilter as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (nationalJobsResults.page.totalElements) {
        if (nationalJobsResults.page.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPaginationNew(
            nationalJobsResults,
            new URL(
              `${req.protocol}://${req.get('host')}${addressLookup.candidateMatching.nationalJobs(id)}?${uri.join(
                '&',
              )}`,
            ),
          )
        }
      }

      // Transform jobs to View Model
      nationalJobsResults.content = plainToInstance(JobViewModel, _.get(nationalJobsResults, 'content', []))

      // Get type of work interested in
      const workTypesOfInterest = _.get(profile, 'profileData.supportAccepted.workInterests.workTypesOfInterest', [])

      // Render data
      const data = {
        id,
        backLocation: getBackLocation({
          req,
          defaultRoute: addressLookup.workProfile(id, 'overview', 'mjma'),
          page: 'matchedJobs',
          uid: id,
        }),
        prisoner: plainToInstance(PrisonerViewModel, prisoner),
        profile,
        nationalJobsResults,
        nationalEmployersList,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
        typeOfWorkOptions: workTypesOfInterest,
        typeOfWorkOtherOptions: Object.keys(typeOfWorkLookup).filter(p => !workTypesOfInterest.includes(p)),
        jobSectorFilter: _.compact(decodeURIComponent(jobSectorFilter as string).split(',')),
        jobSectorFilterOther: _.compact(decodeURIComponent(jobSectorFilterOther as string).split(',')),
        employerFilter: decodeURIComponent(employerFilter as string),
        offenceExclusionsOptions: [
          excludingOffences.ARSON,
          excludingOffences.DRIVING,
          excludingOffences.MURDER,
          excludingOffences.SEXUAL,
          excludingOffences.TERRORISM,
        ],
        offenceFilter: decodeURIComponent(offenceFilter as string),
        filtered:
          // Mark as filtered if any of the locationFilter, jobSectorFilter, jobSectorFilterOther, offenceFilter or distanceFilter have been changed by the user.
          !_.isEqual(decodeURIComponent(jobSectorFilter as string).split(','), workTypesOfInterest) ||
          !_.isEmpty(decodeURIComponent(jobSectorFilterOther as string).split(',')) ||
          !_.isEmpty(decodeURIComponent(offenceFilter as string).split(',')) ||
          decodeURIComponent(employerFilter as string),
      }

      setSessionData(req, ['nationalJobs', 'data'], data)

      res.render('pages/candidateMatching/nationalJobs/index', { ...data })
    } catch (err) {
      logger.error('Error rendering page - National jobs')
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { sort, order } = req.query
    const { jobSectorFilter = [], jobSectorFilterOther = [], employerFilter = '', offenceFilter = [] } = req.body
    const { offenceFilterEnabled } = res.locals

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['nationalJobs', 'data'])
      const errors = validateFormSchema(req, validationSchema())
      const { nationalEmployersList } = req.context

      if (errors) {
        res.render('pages/candidateMatching/nationalJobs/index', {
          ...data,
          errors,
          nationalEmployersList,
          jobSectorFilter,
          jobSectorFilterOther,
          employerFilter,
          offenceFilter,
        })
        return
      }

      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        jobSectorFilter.length && `jobSectorFilter=${encodeURIComponent(jobSectorFilter.join(','))}`,
        jobSectorFilterOther.length && `jobSectorFilterOther=${encodeURIComponent(jobSectorFilterOther.join(','))}`,
        employerFilter && `employerFilter=${encodeURIComponent(employerFilter)}`,
        offenceFilterEnabled && `offenceFilter=${encodeURIComponent(offenceFilter.join(','))}`,
      ].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.candidateMatching.nationalJobs(id)}?${uri.join('&')}`
          : addressLookup.candidateMatching.nationalJobs(id),
      )
    } catch (err) {
      logger.error('Error posting form - National jobs')
      next(err)
    }
  }
}
