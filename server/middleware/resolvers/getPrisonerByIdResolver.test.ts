/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getPrisonerByIdResolver'

describe('validationSchema', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = {}
  req.id = 'mock_ref'

  const mockData = {
    prisoner: {
      firstName: 'mock_firstName',
      lastName: 'mock_lastName',
    },
  }

  const serviceMock = {
    getPrisonerById: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getPrisonerById.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getPrisonerById.mockResolvedValue(mockData.prisoner)

    await resolver(req, res, next)

    expect(req.context.prisoner).toEqual(mockData.prisoner)
    expect(next).toHaveBeenCalledWith()
  })
})
