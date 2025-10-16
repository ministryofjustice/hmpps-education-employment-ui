/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getNationalEmployersListResolver'

describe('getNationalEmployersListResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI' } }

  const mockData = {
    content: [
      {
        id: '01985596-9632-7223-acda-792a6d8e4379',
        jobTitle: 'Asda Test Second Title',
        employerName: 'ASDA',
        sector: 'RETAIL',
        postcode: 'null',
        closingDate: 'null',
        hasExpressedInterest: 'false',
        createdAt: '2025-07-29T09:49:49.211950Z',
        distance: 'null',
        isNational: 'true',
        numberOfVacancies: 10,
      },
    ],
  }

  const serviceMock = {
    getEmployersWithNationalJobs: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getEmployersWithNationalJobs.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getEmployersWithNationalJobs.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.nationalEmployersList).toEqual(mockData)
    expect(next).toHaveBeenCalledWith()
  })
})
