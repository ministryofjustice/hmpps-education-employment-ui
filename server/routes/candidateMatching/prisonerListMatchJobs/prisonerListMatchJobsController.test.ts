/* eslint-disable @typescript-eslint/no-explicit-any */
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './prisonerListMatchJobsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'
import config from '../../../config'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('PrisonerListMatchJobsController', () => {
  const { res, req, next } = expressMocks()
  const searchTerm = 'Smith, John'

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.prisonerListMatchedJobs = {
    content: [
      {
        prisonerNumber: 'A1111AA',
        displayName: 'prisoner 1',
        releaseDate: 'mock_releaseDate',
        status: 'mock_status',
      },
      {
        prisonerNumber: 'A1111BB',
        displayName: 'prisoner 2',
        releaseDate: 'mock_releaseDate',
        status: 'mock_status',
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
    searchTerm: '',
    filterStatus: 'ALL',
  }

  req.params.sort = 'releaseDate'
  req.params.order = 'descending'
  const { sort, order } = req.params

  req.query = {
    sort,
    order,
    prisonerNameFilter: encodeURIComponent(searchTerm),
    typeOfWorkFilter: '',
    showNeedsSupportFilter: false,
  }
  req.get = jest.fn()

  const mockData = req.context.prisonerListMatchedJobs

  const mockPaginationService: any = {
    paginationData: {},
    getPagination: jest.fn(),
  }

  const paginationData = {}

  const controller = new Controller(mockPaginationService)

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
        'pages/candidateMatching/prisonerListMatchJobs/index',
        expect.objectContaining({
          filtered: searchTerm,
          notFoundMsg: undefined,
          order: 'descending',
          paginationData: {},
          prisonerNameFilter: searchTerm,
          prisonerSearchResults: mockData,
          showNeedsSupportFilter: false,
          sort: 'releaseDate',
          typeOfWorkFilter: '',
          userActiveCaseLoad: res.locals.userActiveCaseLoad,
        }),
      )

      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - records found - audits', async () => {
      await controller.get(req, res, next)
      next.mockReset()

      expect(auditSpy).toHaveBeenCalledTimes(2)

      const auditSearch = auditSpy.mock.calls[0][0]
      const auditResults = auditSpy.mock.calls[1][0]

      expect(auditResults.correlationId).toEqual(auditSearch.correlationId)
      expect(auditSearch).toMatchObject({
        action: 'SEARCH_PRISONERS',
        who: res.locals.user.username,
        subjectType: 'SEARCH_TERM',
        subjectId: searchTerm,
        service: config.apis.hmppsAudit.auditServiceName,
        details: JSON.stringify({
          userActiveCaseLoad: res.locals.userActiveCaseLoad.caseLoadId,
          prisonerNameFilter: searchTerm,
          typeOfWorkFilter: req.query.typeOfWorkFilter,
          showNeedsSupportFilter: req.query.showNeedsSupportFilter,
        }),
      })
      expect(auditResults).toMatchObject({
        action: 'SEARCH_PRISONERS_RESULTS',
        who: res.locals.user.username,
        subjectType: 'SEARCH_TERM',
        subjectId: searchTerm,
        service: config.apis.hmppsAudit.auditServiceName,
        details: JSON.stringify([{ prisonNumber: 'A1111AA' }, { prisonNumber: 'A1111BB' }]),
      })
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }
    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      validationMock.mockReset()
      setSessionData(req, ['prisonerListMatchJobs', 'data'], mockData)
      mockPaginationService.getPagination.mockReturnValue(paginationData)
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('On error - Calls next with error', async () => {
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with correct data', async () => {
      validationMock.mockImplementation(() => errors)

      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/prisonerListMatchJobs/index', {
        ...mockData,
        errors,
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.prisonerNameFilter = 'name1'
      req.body.typeOfWorkFilter = 'COOKING'
      req.body.showNeedsSupportFilter = 'true'

      controller.post(req, res, next)

      expect(getSessionData(req, ['prisonerListMatchJobs', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/mjma/prisoners?sort=releaseDate&order=descending&showNeedsSupportFilter=true&prisonerNameFilter=name1&typeOfWorkFilter=COOKING`,
      )
    })
  })
})
