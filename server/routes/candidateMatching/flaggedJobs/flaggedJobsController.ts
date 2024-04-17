/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import _ from 'lodash'
import { plainToClass } from 'class-transformer'

import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import JobViewModel from '../../../viewModels/jobViewModel'
import addressLookup from '../../addressLookup'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

export default class FlaggedJobsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { page, sort, order } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const { prisoner, flaggedJobsResults } = req.context

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [sort && `sort=${sort}`, order && `order=${order}`, page && `page=${page}`].filter(val => !!val)

      // Build pagination or error messages
      if (flaggedJobsResults.totalElements) {
        if (flaggedJobsResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            flaggedJobsResults,
            new URL(
              `${req.protocol}://${req.get('host')}${addressLookup.candidateMatching.flaggedJobs(id)}?${uri.join('&')}`,
            ),
          )
        }
      }

      // Transform jobs to View Model
      flaggedJobsResults.content = plainToClass(JobViewModel, _.get(flaggedJobsResults, 'content', []))

      // Render data
      const data = {
        id,
        backLocation: addressLookup.candidateMatching.workProfile(id),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        flaggedJobsResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
      }

      res.render('pages/candidateMatching/flaggedJobs/index', { ...data })
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
          ? `${addressLookup.candidateMatching.flaggedJobs(id)}?${uri.join('&')}`
          : addressLookup.candidateMatching.flaggedJobs(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
