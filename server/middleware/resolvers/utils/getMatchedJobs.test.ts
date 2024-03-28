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

  it('On error - Throws error', async () => {
    serviceMock.getMatchedJobs.mockRejectedValue(error)

    try {
      await getMatchedJobs(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getMatchedJobs.mockRejectedValue({
      status: 404,
    })

    const result = await getMatchedJobs(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getMatchedJobs.mockResolvedValue(mockData)

    const result = await getMatchedJobs(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
