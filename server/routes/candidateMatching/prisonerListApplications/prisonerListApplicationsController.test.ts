/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './prisonerListApplicationsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('PrisonerListApplicationsController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.prisonerListApplications = {
    prisonerSearchResults: {
      prisonerSearchResults: [
        {
          displayName: 'mock_displayName',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
        },
        {
          displayName: 'mock_displayName2',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
        },
      ],
      totalElements: 2,
    },
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

  req.query = { sort, order }
  req.get = jest.fn()

  const mockData = req.context.prisonerListApplications

  const mockPaginationService: any = {
    paginationData: {},
    getPagination: jest.fn(),
  }

  const paginationData = {}

  const controller = new Controller(mockPaginationService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/prisonerListApplications/index', {
        prisonerSearchResults: {
          filterStatus: 'ALL',
          order: 'descending',
          prisonerSearchResults: {
            prisonerSearchResults: [
              {
                displayName: 'mock_displayName',
                releaseDate: 'mock_releaseDate',
                status: 'mock_status',
              },
              {
                displayName: 'mock_displayName2',
                releaseDate: 'mock_releaseDate',
                status: 'mock_status',
              },
            ],
            totalElements: 2,
          },
          searchTerm: '',
          sort: 'releaseDate',
          userActiveCaseLoad: {
            activeCaseLoad: {
              caseLoadId: 'MDI',
            },
          },
        },
        filtered: '',
        notFoundMsg: undefined,
        order: 'descending',
        paginationData: {},
        prisonerNameFilter: '',
        jobFilter: '',
        sort: 'releaseDate',
        applicationStatusFilter: '',
        userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } },
      })
      expect(next).toHaveBeenCalledTimes(0)
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
      setSessionData(req, ['ciagList', 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/prisonerListApplications/index', {
        ...mockData,
        errors,
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.prisonerNameFilter = 'name1'
      req.body.applicationStatusFilter = 'TEST_STATUS'
      req.body.jobFilter = 'Carpenter'

      controller.post(req, res, next)

      expect(getSessionData(req, ['ciagList', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/cms/applications?sort=releaseDate&order=descending&jobFilter=Carpenter&prisonerNameFilter=name1&applicationStatusFilter=TEST_STATUS`,
      )
    })
  })
})
