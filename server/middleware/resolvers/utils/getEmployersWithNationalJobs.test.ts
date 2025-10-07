/* eslint-disable @typescript-eslint/no-explicit-any */
import getEmployersWithNationalJobs from './getEmployersWithNationalJobs'

describe('getEmployersWithNationalJobs', () => {
  const username = 'mock_username'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getEmployersWithNationalJobs: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getEmployersWithNationalJobs.mockRejectedValue(error)

    try {
      await getEmployersWithNationalJobs(serviceMock as any, username)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getEmployersWithNationalJobs.mockRejectedValue({
      status: 404,
    })

    const result = await getEmployersWithNationalJobs(serviceMock as any, username)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getEmployersWithNationalJobs.mockResolvedValue(mockData)

    const result = await getEmployersWithNationalJobs(serviceMock as any, username)

    expect(result).toEqual(mockData)
  })
})
