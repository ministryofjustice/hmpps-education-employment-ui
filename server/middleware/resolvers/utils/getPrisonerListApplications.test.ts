/* eslint-disable @typescript-eslint/no-explicit-any */
import getPrisonerListApplications from './getPrisonerListApplications'

describe('getPrisonerListApplications', () => {
  const username = 'mock_username'
  const params = {
    prisonId: 'P123',
    page: 1,
    sort: 'name',
    order: 'asc',
    applicationStatusFilter: 'APPLIED',
    prisonerNameFilter: 'John Doe',
    jobFilter: 'Cleaner',
  }

  const mockData = {
    content: [
      {
        prisonerId: 'A1234BC',
        name: 'John Doe',
        job: 'Cleaner',
        status: 'APPLIED',
      },
    ],
    page: {
      size: 1,
      number: 1,
      totalElements: 1,
      totalPages: 1,
    },
  }

  const jobApplicationServiceMock = {
    prisonerApplicationSearch: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    jobApplicationServiceMock.prisonerApplicationSearch.mockRejectedValue(error)

    try {
      await getPrisonerListApplications(jobApplicationServiceMock as any, username, params)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns empty content and page data', async () => {
    jobApplicationServiceMock.prisonerApplicationSearch.mockRejectedValue({
      status: 404,
    })

    const result = await getPrisonerListApplications(jobApplicationServiceMock as any, username, params)

    expect(result).toEqual({
      content: [],
      page: {
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      },
    })
  })

  it('On success - Returns correct data', async () => {
    jobApplicationServiceMock.prisonerApplicationSearch.mockResolvedValue(mockData)

    const result = await getPrisonerListApplications(jobApplicationServiceMock as any, username, params)

    expect(result).toEqual(mockData)
  })
})
