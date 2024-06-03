/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getJobDetailsResolver'
import getJobDetails from './utils/getJobDetails'

jest.mock('./utils/getJobDetails', () => ({
  ...jest.requireActual('./utils/getJobDetails'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getJobDetailsResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = {
    data: 'mock',
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  const getJobDetailsMock = getJobDetails as jest.Mock

  it('On error - Calls next with error', async () => {
    getJobDetailsMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getJobDetailsMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.jobDetails).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
