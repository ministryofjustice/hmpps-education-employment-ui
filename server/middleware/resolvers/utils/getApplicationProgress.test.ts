/* eslint-disable @typescript-eslint/no-explicit-any */
import getApplicationProgress from './getApplicationProgress'

describe('getApplicationProgress', () => {
  const username = 'mock_username'
  const offenderNo = 'mock_ref'
  const jobId = 'mock_job_id'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getApplicationProgress: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getApplicationProgress.mockRejectedValue(error)

    try {
      await getApplicationProgress(serviceMock as any, username, offenderNo, jobId)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getApplicationProgress.mockRejectedValue({
      status: 404,
    })

    const result = await getApplicationProgress(serviceMock as any, username, offenderNo, jobId)

    expect(result).toEqual({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getApplicationProgress.mockResolvedValue(mockData)

    const result = await getApplicationProgress(serviceMock as any, username, offenderNo, jobId)

    expect(result).toEqual(mockData)
  })
})
