/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import Controller from './prisonerListMatchedJobsController'

describe('PrisonerListMatchedJobsController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.PrisonerListMatchedJobs = {
    prisonerSearchResults: {
      prisonerSearchResults: [
        {
          displayName: 'mock_displayName',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
          workSummary: 'mock_workSummary',
          updatedOn: 'mock_updateOn',
        },
        {
          displayName: 'mock_displayName2',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
          workSummary: 'mock_workSummary',
          updatedOn: 'mock_updateOn',
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

  const mockData = req.context.PrisonerListMatchedJobs

  const mockSearchService: any = {
    searchByReleaseDateRaw: jest.fn(),
  }
  const mockPaginationService: any = {
    paginationData: {},
    getPagination: jest.fn(),
  }

  const controller = new Controller(mockSearchService, mockPaginationService)

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

    // it('On success - records found - call renders with the correct data', async () => {
    //   await controller.get(req, res, next)
    //   next.mockReset()

    //   expect(res.render).toHaveBeenCalledWith(
    //     'pages/prisonerListMatchedJobs/index',
    //     expect.objectContaining({
    //       filterStatus: 'ALL',
    //       searchTerm: '',
    //       order: 'descending',
    //       paginationData: {},
    //       prisonerSearchResults: {
    //         filterStatus: 'ALL',
    //         searchTerm: '',
    //         order: 'descending',
    //         ...mockData,
    //         sort: 'releaseDate',
    //         userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI' } },
    //       },
    //       sort: 'releaseDate',
    //       userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } },
    //     }),
    //   )
    //   expect(next).toHaveBeenCalledTimes(0)
    // })
  })
})
