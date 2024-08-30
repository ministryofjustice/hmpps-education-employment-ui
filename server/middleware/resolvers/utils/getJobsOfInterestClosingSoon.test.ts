/* eslint-disable @typescript-eslint/no-explicit-any */
import getJobsOfInterestClosingSoon from './getJobsOfInterestClosingSoon'

describe('getJobsOfInterestClosingSoonClosingSoon', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getJobsOfInterestClosingSoon: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getJobsOfInterestClosingSoon.mockRejectedValue(error)

    try {
      await getJobsOfInterestClosingSoon(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getJobsOfInterestClosingSoon.mockRejectedValue({
      status: 404,
    })

    const result = await getJobsOfInterestClosingSoon(serviceMock as any, username, id)

    expect(result).toEqual({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getJobsOfInterestClosingSoon.mockResolvedValue(mockData)

    const result = await getJobsOfInterestClosingSoon(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
