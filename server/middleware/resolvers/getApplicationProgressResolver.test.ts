/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getApplicationProgressResolver'
import getApplicationProgress from './utils/getApplicationProgress'

jest.mock('./utils/getApplicationProgress', () => ({
  ...jest.requireActual('./utils/getApplicationProgress'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getApplicationProgressResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = {
    data: 'mock',
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getApplicationProgressMock = getApplicationProgress as jest.Mock

  it('On error - Calls next with error', async () => {
    getApplicationProgressMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getApplicationProgressMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.applicationProgress).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
