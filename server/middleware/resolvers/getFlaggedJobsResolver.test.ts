/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getFlaggedJobsResolver'

describe('getFlaggedJobsResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI' } }

  const mockData = {
    content: [
      {
        employerName: 'Amazon',
        jobTitle: 'Forklift operator',
        closingDate: '2025-08-04',
        distance: 4.1,
        city: 'Leeds',
        postcode: 'LS23 3JF',
        typeOfWork: 'OUTDOOR',
      },
    ],
  }

  const serviceMock = {
    getFlaggedJobs: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getFlaggedJobs.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getFlaggedJobs.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.flaggedJobsResults).toEqual(mockData)
    expect(next).toHaveBeenCalledWith()
  })
})
