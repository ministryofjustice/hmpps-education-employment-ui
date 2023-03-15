/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getComByIdResolver'

describe('getComByIdResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
  }

  const serviceMock = {
    getComForOffender: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next without error', async () => {
    serviceMock.getComForOffender.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getComForOffender.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getComForOffender.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.com).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
