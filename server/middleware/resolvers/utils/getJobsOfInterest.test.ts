/* eslint-disable @typescript-eslint/no-explicit-any */
import getJobsOfInterest from './getJobsOfInterest'

describe('getJobsOfInterest', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getJobsOfInterest: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getJobsOfInterest.mockRejectedValue(error)

    try {
      await getJobsOfInterest(serviceMock as any, username, { offenderNo: id })
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getJobsOfInterest.mockRejectedValue({
      status: 404,
    })

    const result = await getJobsOfInterest(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getJobsOfInterest.mockResolvedValue(mockData)

    const result = await getJobsOfInterest(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual(mockData)
  })
})
