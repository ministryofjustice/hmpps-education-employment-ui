/* eslint-disable @typescript-eslint/no-explicit-any */
import getKeyworkerById from './getKeyworkerById'

describe('getKeyworkerById', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    staffId: 485588,
    firstName: 'STEVE',
    lastName: 'RENDELL',
  }

  const serviceMock = {
    getKeyworkerForOffender: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getKeyworkerForOffender.mockRejectedValue(error)

    try {
      await getKeyworkerById(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getKeyworkerForOffender.mockResolvedValue(mockData)

    const result = await getKeyworkerById(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
