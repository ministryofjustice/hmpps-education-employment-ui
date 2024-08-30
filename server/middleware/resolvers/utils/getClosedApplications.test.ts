/* eslint-disable @typescript-eslint/no-explicit-any */
import getClosedApplications from './getClosedApplications'

describe('getClosedApplications', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getClosedApplications: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getClosedApplications.mockRejectedValue(error)

    try {
      await getClosedApplications(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getClosedApplications.mockRejectedValue({
      status: 404,
    })

    const result = await getClosedApplications(serviceMock as any, username, id)

    expect(result).toEqual({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getClosedApplications.mockResolvedValue(mockData)

    const result = await getClosedApplications(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
