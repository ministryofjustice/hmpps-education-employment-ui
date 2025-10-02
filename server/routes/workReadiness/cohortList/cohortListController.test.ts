/* eslint-disable @typescript-eslint/no-explicit-any */
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './cohortListController'
import config from '../../../config'
import TimeToRelease from '../../../enums/timeToRelease'

describe('CohortListController', () => {
  const { res, req, next } = expressMocks()
  const searchTerm = 'Smith, John'

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.cohortList = {
    content: [
      {
        prisonerNumber: 'A1111AA',
        displayName: 'mock_displayName',
        releaseDate: 'mock_releaseDate',
        status: 'mock_status',
        workSummary: 'mock_workSummary',
        updatedOn: 'mock_updateOn',
      },
      {
        prisonerNumber: 'A1111BB',
        displayName: 'mock_displayName2',
        releaseDate: 'mock_releaseDate',
        status: 'mock_status',
        workSummary: 'mock_workSummary',
        updatedOn: 'mock_updateOn',
      },
    ],
    totalElements: 2,
    sort: 'releaseDate',
    order: 'descending',
    userActiveCaseLoad: {
      activeCaseLoad: {
        caseLoadId: 'MDI',
      },
    },
    searchTerm: encodeURIComponent(searchTerm),
    filterStatus: 'ALL',
  }

  req.params.sort = 'releaseDate'
  req.params.order = 'descending'
  const { sort, order } = req.params

  req.query = { sort, order, searchTerm: encodeURIComponent(searchTerm) }
  req.get = jest.fn()

  const mockData = req.context.cohortList

  const mockSearchService: any = {
    searchByReleaseDateRaw: jest.fn(),
  }
  const mockPaginationService: any = {
    paginationData: {},
    getPagination: jest.fn(),
  }

  const controller = new Controller(mockSearchService, mockPaginationService)

  describe('#get(req, res)', () => {
    const auditSpy = jest.spyOn(auditService, 'sendAuditMessage')

    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()

      config.apis.hmppsAudit.enabled = true
      auditSpy.mockReset()
      auditSpy.mockResolvedValue()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - records found - call renders with the correct data', async () => {
      await controller.get(req, res, next)
      next.mockReset()

      expect(res.render).toHaveBeenCalledWith(
        'pages/workReadiness/cohortList/index',
        expect.objectContaining({
          prisonerSearchResults: mockData,
          sort: 'releaseDate',
          order: 'descending',
          paginationData: {},
          userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } },
          searchTerm,
          selectStatus: 'ALL',
          timeToRelease: 'TWELVE_WEEKS',
        }),
      )
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - records found - audits search', async () => {
      await controller.get(req, res, next)
      next.mockReset()

      expect(auditSpy).toHaveBeenCalledTimes(2)

      const auditSearch = auditSpy.mock.calls[0][0]
      const auditResults = auditSpy.mock.calls[1][0]

      expect(auditResults.correlationId).toEqual(auditSearch.correlationId)
      expect(auditSearch).toMatchObject({
        action: 'SEARCH_COHORT',
        who: res.locals.user.username,
        subjectType: 'SEARCH_TERM',
        subjectId: searchTerm,
        service: config.apis.hmppsAudit.auditServiceName,
        details: JSON.stringify({
          userActiveCaseLoad: res.locals.userActiveCaseLoad.caseLoadId,
          selectStatus: 'ALL',
          timeToRelease: TimeToRelease.TWELVE_WEEKS,
        }),
      })
      expect(auditResults).toMatchObject({
        action: 'SEARCH_COHORT_RESULTS',
        who: res.locals.user.username,
        subjectType: 'SEARCH_TERM',
        subjectId: searchTerm,
        service: config.apis.hmppsAudit.auditServiceName,
        details: JSON.stringify([{ prisonerNumber: 'A1111AA' }, { prisonerNumber: 'A1111BB' }]),
      })
    })
  })
})
