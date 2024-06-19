/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './jobsOfInterestController'
import { getSessionData, setSessionData } from '../../../utils/session'

describe('jobsOfInterestController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.jobsOfInterestResults = {
    content: [],
    totalElements: 0,
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

  const mockData = req.context.jobsOfInterestResults

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

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/jobsOfInterest/index', {
        backLocation: '/cms/profile/mock_id/view/overview',
        prisoner: undefined,
        notFoundMsg: undefined,
        order: 'descending',
        paginationData: {},
        id: 'mock_id',
        jobsOfInterestResults: {
          filterStatus: 'ALL',
          order: 'descending',
          content: [],
          totalElements: 0,
          searchTerm: '',
          sort: 'releaseDate',
          userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI' } },
        },
        sort: 'releaseDate',
        userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } },
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      setSessionData(req, ['ciagList', 'data'], mockData)
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

      expect(getSessionData(req, ['ciagList', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(`/cms/${id}/jobs/interested?sort=releaseDate&order=descending`)
    })
  })
})
