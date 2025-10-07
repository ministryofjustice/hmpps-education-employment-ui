/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './nationalJobsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('NationalJobsController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.nationalJobsResults = {
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

  const mockNationalJobsResults = req.context.nationalJobsResults
  const mockNationalEmployersList = req.context.nationalEmployersList

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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/nationalJobs/index', {
        backLocation: '/mjma/profile/mock_id/view/overview',
        profile: undefined,
        prisoner: undefined,
        notFoundMsg: undefined,
        order: 'descending',
        paginationData: {},
        filtered: true,
        id: 'mock_id',
        nationalJobsResults: {
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
        employerFilter: '',
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
      setSessionData(req, ['nationalJobs', 'data'], mockNationalJobsResults)
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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/nationalJobs/index', {
        ...mockNationalJobsResults,
        ...mockNationalEmployersList,
        errors,
        filterStatus: 'ALL',
        jobSectorFilter: [],
        jobSectorFilterOther: [],
        employerFilter: '',
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.jobSectorFilter = ['COOKING']
      req.body.employerFilter = '1000'

      controller.post(req, res, next)

      expect(getSessionData(req, ['nationalJobs', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/mjma/${id}/jobs/national-jobs?sort=releaseDate&order=descending&jobSectorFilter=COOKING&employerFilter=1000`,
      )
    })
  })
})
