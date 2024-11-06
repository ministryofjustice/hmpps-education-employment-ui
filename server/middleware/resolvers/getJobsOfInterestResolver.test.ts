/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getJobsOfInterestResolver'

describe('getJobsOfInterestResolver', () => {
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
    getJobsOfInterest: jest.fn(),
    getAddressForOffender: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any, serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getJobsOfInterest.mockRejectedValue(error)
    serviceMock.getAddressForOffender.mockResolvedValue({})

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getJobsOfInterest.mockResolvedValue(mockData)
    serviceMock.getAddressForOffender.mockResolvedValue({})

    await resolver(req, res, next)

    expect(req.context.jobsOfInterestResults).toEqual(mockData)
    expect(next).toHaveBeenCalledWith()
  })
})
