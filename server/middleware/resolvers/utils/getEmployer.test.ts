/* eslint-disable @typescript-eslint/no-explicit-any */
import getEmployer from './getEmployer'

describe('getEmployer', () => {
  const username = 'mock_username'
  const employerId = 'mock_employer_id'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getEmployer: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getEmployer.mockRejectedValue(error)

    try {
      await getEmployer(serviceMock as any, username, employerId)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Calls next without error', async () => {
    serviceMock.getEmployer.mockRejectedValue({
      status: 404,
    })

    const result = await getEmployer(serviceMock as any, username, employerId)

    expect(result).toEqual(undefined)
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getEmployer.mockResolvedValue(mockData)

    const result = await getEmployer(serviceMock as any, username, employerId)

    expect(result).toEqual(mockData)
  })
})
