/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import _ from 'lodash'
import { plainToClass } from 'class-transformer'

import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import JobViewModel from '../../../viewModels/jobViewModel'
import addressLookup from '../../addressLookup'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import { getBackLocation, setSessionData } from '../../../utils/index'

export default class ArchivedJobsController {
  constructor(private readonly paginationService: PaginationService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { page, sort, order } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const { prisoner, archivedJobsResults } = req.context

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [sort && `sort=${sort}`, order && `order=${order}`, page && `page=${page}`].filter(val => !!val)

      // Build pagination or error messages
      if (archivedJobsResults.totalElements) {
        if (archivedJobsResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            archivedJobsResults,
            new URL(
              `${req.protocol}://${req.get('host')}${addressLookup.candidateMatching.archivedJobs(id)}?${uri.join(
                '&',
              )}`,
            ),
          )
        }
      }

      // Transform jobs to View Model
      archivedJobsResults.content = plainToClass(JobViewModel, _.get(archivedJobsResults, 'content', []))

      // Render data
      const data = {
        id,
        backLocation: getBackLocation({
          req,
          defaultRoute: addressLookup.candidateMatching.workProfile(id),
          page: 'archivedJobs',
          uid: id,
        }),
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        archivedJobsResults,
        sort,
        order,
        paginationData,
        userActiveCaseLoad,
        notFoundMsg,
      }

      // Set page data in session
      setSessionData(req, ['archivedJobs', id, 'data'], data)

      res.render('pages/candidateMatching/archivedJobs/index', { ...data })
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
          ? `${addressLookup.candidateMatching.archivedJobs(id)}?${uri.join('&')}`
          : addressLookup.candidateMatching.archivedJobs(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
