/* eslint-disable @typescript-eslint/no-explicit-any */
import getArchivedJobs from './getArchivedJobs'

describe('getArchivedJobs', () => {
  const username = 'mock_username'
  const id = 'mock_ref'

  const mockData = {
    text: 'Mock data',
  }

  const serviceMock = {
    getArchivedJobs: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getArchivedJobs.mockRejectedValue(error)

    try {
      await getArchivedJobs(serviceMock as any, username, { offenderNo: id })
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getArchivedJobs.mockRejectedValue({
      status: 404,
    })

    const result = await getArchivedJobs(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getArchivedJobs.mockResolvedValue(mockData)

    const result = await getArchivedJobs(serviceMock as any, username, { offenderNo: id })

    expect(result).toEqual(mockData)
  })
})
