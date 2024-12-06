/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './jobsOfInterestController'

describe('jobsOfInterestController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.jobsOfInterestResults = {
    content: [],
    page: {
      totalElements: 0,
    },
  }

  req.params.sort = 'releaseDate'
  req.params.order = 'descending'
  req.params.id = 'mock_id'
  const { sort, order, id } = req.params

  req.query = { sort, order }
  req.get = jest.fn()

  const mockPaginationService: any = {
    paginationData: {},
    getPagination: jest.fn(),
  }

  const mockData = {
    backLocation: '/mjma/profile/mock_id/view/overview',
    id: 'mock_id',
    jobsOfInterestResults: {
      content: [] as any,
      page: {
        totalElements: 0,
      },
    },
    order: 'descending',
    paginationData: {},
    sort: 'releaseDate',
    userActiveCaseLoad: {
      activeCaseLoad: {
        caseLoadId: 'MDI',
        description: 'Moorland (HMP & YOI)',
      },
    },
    workTypesOfInterest: [] as any,
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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/jobsOfInterest/index', mockData)
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      mockPaginationService.getPagination.mockReturnValue(paginationData)
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.locationFilter = 'name1'
      req.body.typeOfWorkFilter = ['COOKING']
      req.body.distanceFilter = 'true'

      controller.post(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(`/mjma/${id}/jobs/interested?sort=releaseDate&order=descending`)
    })
  })
})
