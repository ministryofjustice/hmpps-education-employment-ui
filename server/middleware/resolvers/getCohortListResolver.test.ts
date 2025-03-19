/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getCohortListResolver'

describe('getCohortListResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI' } }

  const mockData = {
    prisonerSearchResults: {
      displayName: 'mock_displayName',
      releaseDate: 'mock_releaseDate',
      status: 'mock_status',
      workSummary: 'mock_workSummary',
      updatedOn: 'mock_updateOn',
    },
  }

  const serviceMock = {
    searchPrisonersByReleaseDate: jest.fn(),
    getPrisonersByReleaseDate: jest.fn().mockReturnValue({ content: [] }),
  }

  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.searchPrisonersByReleaseDate.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.searchPrisonersByReleaseDate.mockResolvedValue(mockData.prisonerSearchResults)

    await resolver(req, res, next)

    expect(req.context.cohortList).toEqual({
      displayName: 'mock_displayName',
      releaseDate: 'mock_releaseDate',
      status: 'mock_status',
      workSummary: 'mock_workSummary',
      updatedOn: 'mock_updateOn',
    })
    expect(next).toHaveBeenCalledWith()
  })
})
