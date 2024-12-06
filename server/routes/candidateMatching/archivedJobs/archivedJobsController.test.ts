/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './archivedJobsController'
import { getSessionData, setSessionData } from '../../../utils/session'

describe('ArchivedJobsController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.archivedJobsResults = {
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

  const mockData = {
    archivedJobsResults: {
      content: [] as any,
      page: {
        totalElements: 0,
      },
    },
    backLocation: '/mjma/profile/mock_id/view/overview',
    id: 'mock_id',
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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/archivedJobs/index', mockData)
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      setSessionData(req, ['archivedJobs', 'data'], mockData)
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

      expect(getSessionData(req, ['archivedJobs', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(`/mjma/${id}/jobs/archived?sort=releaseDate&order=descending`)
    })
  })
})
