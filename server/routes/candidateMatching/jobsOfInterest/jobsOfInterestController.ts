/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import _ from 'lodash'
import { plainToClass } from 'class-transformer'

import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import JobViewModel from '../../../viewModels/jobViewModel'
import addressLookup from '../../addressLookup'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class JobsOfInterestController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { page, sort, order } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const { prisoner, jobsOfInterestResults } = req.context

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [sort && `sort=${sort}`, order && `order=${order}`, page && `page=${page}`].filter(val => !!val)

      // Build pagination or error messages
      if (jobsOfInterestResults.totalElements) {
        if (jobsOfInterestResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            jobsOfInterestResults,
            new URL(
              `${req.protocol}://${req.get('host')}${addressLookup.candidateMatching.jobsOfInterest(id)}?${uri.join(
                '&',
              )}`,
            ),
          )
        }
      }

      // Transform jobs to View Model
      jobsOfInterestResults.content = plainToClass(JobViewModel, _.get(jobsOfInterestResults, 'content', []))

      // Render data
      const data = {
        id,
        backLocation: addressLookup.candidateMatching.workProfile(id),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        jobsOfInterestResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
      }

      res.render('pages/candidateMatching/jobsOfInterest/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { sort, order } = req.query

    try {
      const uri = [sort && `sort=${sort}`, order && `order=${order}`].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.candidateMatching.jobsOfInterest(id)}?${uri.join('&')}`
          : addressLookup.candidateMatching.jobsOfInterest(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
