/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getPrisonerListMatchJobsResolver'

describe('getPrisonerListMatchJobsResolver', () => {
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
    getPrisonersToMatchJobs: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getPrisonersToMatchJobs.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getPrisonersToMatchJobs.mockResolvedValue(mockData.prisonerSearchResults)

    await resolver(req, res, next)

    expect(req.context.prisonerListMatchedJobs).toEqual({
      displayName: 'mock_displayName',
      releaseDate: 'mock_releaseDate',
      status: 'mock_status',
      workSummary: 'mock_workSummary',
      updatedOn: 'mock_updateOn',
    })
    expect(next).toHaveBeenCalledWith()
  })
})
