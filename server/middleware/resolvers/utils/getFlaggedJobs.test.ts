/* eslint-disable @typescript-eslint/no-explicit-any */
import getFlaggedJobs from './getFlaggedJobs'

describe('getFlaggedJobs', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getFlaggedJobs: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getFlaggedJobs.mockRejectedValue(error)

    try {
      await getFlaggedJobs(serviceMock as any, username, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getFlaggedJobs.mockRejectedValue({
      status: 404,
    })

    const result = await getFlaggedJobs(serviceMock as any, username, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getFlaggedJobs.mockResolvedValue(mockData)

    const result = await getFlaggedJobs(serviceMock as any, username, id)

    expect(result).toEqual(mockData)
  })
})
