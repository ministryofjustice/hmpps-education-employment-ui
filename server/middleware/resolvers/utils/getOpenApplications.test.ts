/* eslint-disable @typescript-eslint/no-explicit-any */
import getOpenApplications from './getOpenApplications'

describe('getOpenApplications', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getOpenApplications: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getOpenApplications.mockRejectedValue(error)

    try {
      await getOpenApplications(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getOpenApplications.mockRejectedValue({
      status: 404,
    })

    const result = await getOpenApplications(serviceMock as any, username, id)

    expect(result).toEqual({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getOpenApplications.mockResolvedValue(mockData)

    const result = await getOpenApplications(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
