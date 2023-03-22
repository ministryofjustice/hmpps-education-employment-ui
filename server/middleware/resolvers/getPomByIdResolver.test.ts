/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getPomByIdResolver'

describe('getPomByIdResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
  }

  const serviceMock = {
    getPomForOffender: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getPomForOffender.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getPomForOffender.mockRejectedValue({
      data: {
        status: 404,
      },
    })

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getPomForOffender.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.pom).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
