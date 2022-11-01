/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getProfileByIdResolver'

describe('getProfileByIdResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = {}
  req.id = 'mock_ref'

  const mockData = {
    profile: {
      prisonerNumber: 'mock_prisonerNumber',
    },
  }

  const serviceMock = {
    getProfileById: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getProfileById.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 400 error - Calls next without error', async () => {
    serviceMock.getProfileById.mockRejectedValue({
      data: {
        status: 400,
        userMessage: 'Readiness profile does not exist',
      },
    })

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getProfileById.mockResolvedValue(mockData.profile)

    await resolver(req, res, next)

    expect(req.context.profile).toEqual({
      prisonerNumber: 'mock_prisonerNumber',
    })
    expect(next).toHaveBeenCalledWith()
  })
})
