/* eslint-disable @typescript-eslint/no-explicit-any */
import getJobDetails from './getJobDetails'

describe('getJobDetails', () => {
  const username = 'mock_username'
  const jobId = 'mock_job_id'
  const id = 'mock_id'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getJobDetails: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getJobDetails.mockRejectedValue(error)

    try {
      await getJobDetails(serviceMock as any, username, jobId, id)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getJobDetails.mockRejectedValue({
      status: 404,
    })

    const result = await getJobDetails(serviceMock as any, username, jobId, id)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getJobDetails.mockResolvedValue(mockData)

    const result = await getJobDetails(serviceMock as any, username, jobId, id)

    expect(result).toEqual(mockData)
  })
})
