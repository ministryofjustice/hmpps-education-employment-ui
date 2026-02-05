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
    content: [
      {
        id: '0194f5cf-0cac-7333-81b1-c9d4f3c98f04',
        jobTitle: 'Dev Test Job 1',
        employerName: 'Dev Test 1 - v11',
        sector: 'OUTDOOR',
        postcode: 'NE15 7LR',
        closingDate: '2026-06-11',
        hasExpressedInterest: false,
        createdAt: '2025-02-11T16:19:35.217290Z',
        distance: null,
        isNational: false,
        numberOfVacancies: 1,
      },
      {
        id: '019c1f86-2266-7cca-bc1e-8a97d791a037',
        jobTitle: 'Dev Test Job 7',
        employerName: 'Dev Test 5',
        sector: 'OUTDOOR',
        postcode: 'NE15 7LR',
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2026-02-02T18:03:30.605822Z',
        distance: null,
        isNational: false,
        numberOfVacancies: 1,
      },
      {
        id: '0191795c-d293-733f-bcf5-5724980adfaf',
        jobTitle: 'test',
        employerName: 'ABC Construction 10',
        sector: 'OUTDOOR',
        postcode: 'NW1 4NP',
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2025-11-12T10:18:10.010566Z',
        distance: null,
        isNational: false,
        numberOfVacancies: 1,
      },
      {
        id: '019a7792-9737-799c-879e-b92934255032',
        jobTitle: 'test',
        employerName: 'ABC Construction 10',
        sector: 'OUTDOOR',
        postcode: 'NW1 4NP',
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2025-11-12T10:18:10.010566Z',
        distance: null,
        isNational: false,
        numberOfVacancies: 1,
      },
      {
        id: '0194d5bc-72c2-733a-b679-16cff5767c2b',
        jobTitle: 'Dummy job',
        employerName: 'ABC Construction 4',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: 'NE15 7LR',
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2025-02-05T10:51:25.438938Z',
        distance: null,
        isNational: false,
        numberOfVacancies: 1,
      },
    ],
    page: {
      size: 5,
      number: 0,
      totalElements: 26,
      totalPages: 6,
    },
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
    getPaginationNew: jest.fn(() => paginationData),
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
        matchedJobsResults: mockData,
        distanceFilter: '50',
        sort: 'releaseDate',
        jobSectorFilter: [],
        typeOfWorkOptions: [],
        typeOfWorkOtherOptions: [
          'OUTDOOR',
          'CLEANING_AND_MAINTENANCE',
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
          'OTHER',
        ],
        userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } },
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - records found - with nationalJobsEnabled, call renders with the correct data', async () => {
      res.locals.nationalJobsEnabled = true
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
        matchedJobsResults: mockData,
        distanceFilter: '0',
        sort: 'releaseDate',
        jobSectorFilter: [],
        typeOfWorkOptions: [],
        typeOfWorkOtherOptions: [
          'OUTDOOR',
          'CLEANING_AND_MAINTENANCE',
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
          'OTHER',
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
      mockPaginationService.getPaginationNew.mockReturnValue(paginationData)
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
        `/mjma/${id}/jobs/matched?sort=releaseDate&order=descending&distanceFilter=true&jobSectorFilter=COOKING&locationFilter=name1&isNationalJob=false`,
      )
    })

    it('On successful POST - with nationalJobsEnabled, call renders with the correct data', async () => {
      res.locals.nationalJobsEnabled = true
      req.body.locationFilter = 'name1'
      req.body.jobSectorFilter = ['COOKING']
      req.body.distanceFilter = '20'
      res.locals.nationalJobsEnabled = true

      controller.post(req, res, next)

      expect(getSessionData(req, ['matchedJobs', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/mjma/${id}/jobs/matched?sort=releaseDate&order=descending&distanceFilter=20&jobSectorFilter=COOKING&locationFilter=name1&isNationalJob=false`,
      )
    })

    it('On successful POST - with nationalJobsEnabled, call renders with the correct data when no locationFilter', async () => {
      res.locals.nationalJobsEnabled = true
      req.body.locationFilter = ''
      req.body.jobSectorFilter = ['COOKING']
      req.body.distanceFilter = '20'
      res.locals.nationalJobsEnabled = true

      controller.post(req, res, next)

      expect(getSessionData(req, ['matchedJobs', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/mjma/${id}/jobs/matched?sort=releaseDate&order=descending&distanceFilter=0&jobSectorFilter=COOKING&locationFilter=none&isNationalJob=false`,
      )
    })
  })
})
