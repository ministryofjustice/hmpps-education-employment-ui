/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getNationalJobsResolver'

describe('getNationalJobsResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI' } }

  const mockData = {
    content: [
      {
        employerName: 'Amazon',
        jobTitle: 'Forklift operator',
        closingDate: '2025-08-04',
        typeOfWork: 'OUTDOOR',
        isNational: true,
        numberOfVacancies: 5,
      },
    ],
  }

  const serviceMock = {
    getMatchedJobs: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getMatchedJobs.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getMatchedJobs.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.nationalJobsResults).toEqual(mockData)
    expect(next).toHaveBeenCalledWith()
  })
})
