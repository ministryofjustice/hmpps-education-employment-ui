/* eslint-disable @typescript-eslint/no-explicit-any */
import getMatchedJobs from './getMatchedJobs'

describe('getMatchedJobs', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getMatchedJobs: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Returns default empty data', async () => {
    serviceMock.getMatchedJobs.mockRejectedValue(error)

    try {
      await getMatchedJobs(serviceMock as any, username, { offenderNo: id })
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getMatchedJobs.mockRejectedValue({
      status: 404,
    })

    const result = await getMatchedJobs(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getMatchedJobs.mockResolvedValue(mockData)

    const result = await getMatchedJobs(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual(mockData)
  })
})
