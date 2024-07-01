/* eslint-disable @typescript-eslint/no-explicit-any */
import getPrisonerAddressById from './getPrisonerAddressById'

describe('getPrisonerAddressById', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    postcode: 'AD15 5DL',
  }

  const serviceMock = {
    getAddressForOffender: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getAddressForOffender.mockRejectedValue(error)

    try {
      await getPrisonerAddressById(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getAddressForOffender.mockRejectedValue({
      status: 404,
    })

    const result = await getPrisonerAddressById(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getAddressForOffender.mockResolvedValue(mockData)

    const result = await getPrisonerAddressById(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
