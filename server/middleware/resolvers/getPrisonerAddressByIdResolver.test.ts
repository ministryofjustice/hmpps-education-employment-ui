/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getPrisonerAddressByIdResolver'
import getPrisonerAddressById from './utils/getPrisonerAddressById'

jest.mock('./utils/getPrisonerAddressById', () => ({
  ...jest.requireActual('./utils/getPrisonerAddressById'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getPrisonerAddressByIdResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    postcode: 'AD23 3DR',
  }

  const serviceMock = {}
  const error = new Error('mock_error')

  const getPrisonerAddressByIdMock = getPrisonerAddressById as jest.Mock

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    getPrisonerAddressByIdMock.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    getPrisonerAddressByIdMock.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.prisonerAddress).toEqual(mockData)

    expect(next).toHaveBeenCalledWith()
  })
})
