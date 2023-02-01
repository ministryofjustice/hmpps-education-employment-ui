/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getKeyworkerByIdResolver'

describe('getKeyworkerByIdResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
    status: 'ACTIVE',
  }

  const serviceMock = {
    getKeyworkerForOffender: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getKeyworkerForOffender.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getKeyworkerForOffender.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getKeyworkerForOffender.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.keyworker).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
