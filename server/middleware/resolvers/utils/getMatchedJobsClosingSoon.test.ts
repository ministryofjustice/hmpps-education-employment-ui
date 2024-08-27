/* eslint-disable @typescript-eslint/no-explicit-any */
import getMatchedJobsClosingSoon from './getMatchedJobsClosingSoon'

describe('getMatchedJobsClosingSoon', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getMatchedJobsClosingSoon: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getMatchedJobsClosingSoon.mockRejectedValue(error)

    try {
      await getMatchedJobsClosingSoon(serviceMock as any, username, { offenderNo: id })
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getMatchedJobsClosingSoon.mockRejectedValue({
      status: 404,
    })

    const result = await getMatchedJobsClosingSoon(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getMatchedJobsClosingSoon.mockResolvedValue(mockData)

    const result = await getMatchedJobsClosingSoon(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual(mockData)
  })
})
