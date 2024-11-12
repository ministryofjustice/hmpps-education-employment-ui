/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './matchedJobsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('MatchedJobsController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.matchedJobsResults = {
    content: [],
    page: {
      totalElements: 0,
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
  req.params.id = 'mock_id'
  const { sort, order, id } = req.params

  req.query = { sort, order }
  req.get = jest.fn()

  const mockData = req.context.matchedJobsResults

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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/matchedJobs/index', {
        backLocation: '/mjma/profile/mock_id/view/overview',
        profile: undefined,
        prisoner: undefined,
        notFoundMsg: undefined,
        order: 'descending',
        paginationData: {},
        locationFilter: '',
        filtered: true,
        id: 'mock_id',
        matchedJobsResults: {
          filterStatus: 'ALL',
          order: 'descending',
          content: [],
          page: {
            totalElements: 0,
          },
          searchTerm: '',
          sort: 'releaseDate',
          userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI' } },
        },
        distanceFilter: '50',
        sort: 'releaseDate',
        jobSectorFilter: [],
        typeOfWorkOptions: [],
        typeOfWorkOtherOptions: [
          'OUTDOOR',
          'CONSTRUCTION',
          'DRIVING',
          'BEAUTY',
          'HOSPITALITY',
          'TECHNICAL',
          'MANUFACTURING',
          'OFFICE',
          'RETAIL',
          'SPORTS',
          'WAREHOUSING',
          'EDUCATION_TRAINING',
          'WASTE_MANAGEMENT',
          'CLEANING_AND_MAINTENANCE',
        ],
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
      setSessionData(req, ['matchedJobs', 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/matchedJobs/index', {
        ...mockData,
        errors,
        filterStatus: 'ALL',
        jobSectorFilter: [],
        jobSectorFilterOther: [],
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.locationFilter = 'name1'
      req.body.jobSectorFilter = ['COOKING']
      req.body.distanceFilter = 'true'

      controller.post(req, res, next)

      expect(getSessionData(req, ['matchedJobs', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/mjma/${id}/jobs/matched?sort=releaseDate&order=descending&distanceFilter=true&jobSectorFilter=COOKING&locationFilter=name1`,
      )
    })
  })
})
