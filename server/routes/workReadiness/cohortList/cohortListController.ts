/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { v7 as uuidv7 } from 'uuid'
import type PrisonerSearchService from '../../../services/prisonSearchService'
import PaginationService from '../../../services/paginationServices'
import config from '../../../config'
import addressLookup from '../../addressLookup'
import TimeToRelease from '../../../enums/timeToRelease'

export default class CohortListController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { page, sort, order, status = '', searchTerm = '', timeToRelease = '' } = req.query
    const { userActiveCaseLoad } = res.locals
    const { paginationPageSize } = config
    const prisonerSearchResults = req.context.cohortList

    try {
      // Paginate where necessary
      let paginationData = {}
      let notFoundMsg

      // Build uri
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        status && status !== 'ALL' && `status=${status}`,
        timeToRelease && `timeToRelease=${timeToRelease}`,
        searchTerm && `searchTerm=${decodeURIComponent(searchTerm as string)}`,
        page && `page=${page}`,
      ].filter(val => !!val)

      // Build pagination or error messages
      if (prisonerSearchResults.totalElements) {
        if (prisonerSearchResults.totalElements > parseInt(paginationPageSize.toString(), 10)) {
          paginationData = this.paginationService.getPagination(
            prisonerSearchResults,
            new URL(`${req.protocol}://${req.get('host')}${addressLookup.workReadiness.cohortList()}?${uri.join('&')}`),
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
        searchTerm: decodeURIComponent(searchTerm as string),
        selectStatus: status || 'ALL',
        timeToRelease: timeToRelease || TimeToRelease.TWELVE_WEEKS,
      }

      if (config.apis.hmppsAudit.enabled) {
        const correlationId = uuidv7()
        await Promise.all([
          auditService.sendAuditMessage({
            correlationId,
            action: 'SEARCH_COHORT',
            who: res.locals.user.username,
            subjectType: 'SEARCH_TERM',
            subjectId: decodeURIComponent(searchTerm as string),
            service: config.apis.hmppsAudit.auditServiceName,
            details: JSON.stringify({
              userActiveCaseLoad: userActiveCaseLoad?.caseLoadId,
              selectStatus: status || 'ALL',
              timeToRelease: timeToRelease || TimeToRelease.TWELVE_WEEKS,
            }),
          }),
          auditService.sendAuditMessage({
            correlationId,
            action: 'SEARCH_COHORT_RESULTS',
            who: res.locals.user.username,
            subjectType: 'SEARCH_TERM',
            subjectId: decodeURIComponent(searchTerm as string),
            service: config.apis.hmppsAudit.auditServiceName,
            details: JSON.stringify(
              prisonerSearchResults.content.map((result: { prisonerNumber: any }) => ({
                prisonNumber: result.prisonerNumber,
              })),
            ),
          }),
        ])
      }

      res.render('pages/workReadiness/cohortList/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { sort, order } = req.query
    const { selectStatus, searchTerm, timeToRelease } = req.body

    try {
      const uri = [
        sort && `sort=${sort}`,
        order && `order=${order}`,
        selectStatus && selectStatus !== 'ALL' && `status=${selectStatus}`,
        timeToRelease && `timeToRelease=${timeToRelease}`,
        searchTerm && `searchTerm=${encodeURIComponent(searchTerm)}`,
      ].filter(val => !!val)

      res.redirect(
        uri.length
          ? `${addressLookup.workReadiness.cohortList()}?${uri.join('&')}`
          : addressLookup.workReadiness.cohortList(),
      )
    } catch (err) {
      next(err)
    }
  }
}
