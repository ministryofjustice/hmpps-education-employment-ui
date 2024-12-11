/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApplicationApiClient from '../data/jobApplicationApi/jobApplicationApiClient'
import PrisonerSearchClient from '../data/prisonerSearch/prisonerSearchClient'
import JobApplicationService from './jobApplicationService'
import config from '../config'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/jobApplicationApi/jobApplicationApiClient')
jest.mock('../data/prisonerSearch/prisonerSearchClient')
jest.mock('../utils/index', () => ({
  offenderEarliestReleaseDate: jest.fn(() => 'mock_future_date'),
  formatDateToyyyyMMdd: jest.fn(() => 'mock_current_date'),
}))

describe('JobApplicationService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let jobApplicationApiClientMock: jest.Mocked<JobApplicationApiClient>
  let prisonerSearchClientMock: jest.Mocked<PrisonerSearchClient>
  let jobApplicationService: JobApplicationService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    jobApplicationApiClientMock = {
      getOpenApplications: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getClosedApplications: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getApplicationProgress: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      updateApplicationProgress: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      applicationSearch: jest.fn().mockResolvedValue({
        content: [{ prisonNumber: 'A1234BC' }, { prisonNumber: 'B5678DE' }],
      }),
    } as unknown as jest.Mocked<JobApplicationApiClient>
    ;(JobApplicationApiClient as any).mockImplementation(() => jobApplicationApiClientMock)

    prisonerSearchClientMock = {
      getPrisonersByReleaseDate: jest.fn().mockResolvedValue({
        content: [{ prisonerNumber: 'A1234BC' }, { prisonerNumber: 'B5678DE' }],
      }),
    } as unknown as jest.Mocked<PrisonerSearchClient>
    ;(PrisonerSearchClient as any).mockImplementation(() => prisonerSearchClientMock)

    jobApplicationService = new JobApplicationService(hmppsAuthClientMock)
  })

  it('#getOpenApplications - should get token and call correct api method', async () => {
    const result = await jobApplicationService.getOpenApplications('user', 'offenderId')

    expect(result).toEqual({ data: 'mock_data' })
    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApplicationApiClientMock.getOpenApplications).toHaveBeenCalledWith('offenderId')
  })

  it('#getClosedApplications - should get token and call correct api method', async () => {
    const result = await jobApplicationService.getClosedApplications('user', 'offenderId')

    expect(result).toEqual({ data: 'mock_data' })
    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApplicationApiClientMock.getClosedApplications).toHaveBeenCalledWith('offenderId')
  })

  it('#prisonerApplicationSearch - should filter applications by eligible prisoners and paginate results', async () => {
    config.paginationPageSize = 1
    const result = await jobApplicationService.prisonerApplicationSearch('user', {
      prisonId: 'MDI',
      page: 1,
      sort: 'prisonerName',
      order: 'ascending',
    })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(prisonerSearchClientMock.getPrisonersByReleaseDate).toHaveBeenCalledWith({
      earliestReleaseDate: 'mock_current_date',
      latestReleaseDate: 'mock_future_date',
      prisonIds: ['MDI'],
    })
    expect(jobApplicationApiClientMock.applicationSearch).toHaveBeenCalledWith({
      prisonId: 'MDI',
      page: 1,
      size: 999999,
      sort: 'prisonerName',
      order: 'ascending',
    })
    expect(result).toEqual({
      content: [{ prisonNumber: 'A1234BC' }],
      page: {
        size: 1,
        number: 0,
        totalElements: 2,
        totalPages: 2,
      },
    })
  })

  it('#prisonerApplicationSearch - should return empty results if no matching applications', async () => {
    prisonerSearchClientMock.getPrisonersByReleaseDate.mockResolvedValueOnce({
      content: [],
    } as any)

    const result = await jobApplicationService.prisonerApplicationSearch('user', {
      prisonId: 'MDI',
      page: 1,
      sort: 'prisonerName',
      order: 'ascending',
    })

    expect(result).toEqual({
      content: [],
      page: {
        size: config.paginationPageSize,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      },
    })
  })

  it('#prisonerApplicationSearch - should throw error if fetching prisoners fails', async () => {
    prisonerSearchClientMock.getPrisonersByReleaseDate.mockRejectedValueOnce(new Error('fetch_error'))

    await expect(
      jobApplicationService.prisonerApplicationSearch('user', {
        prisonId: 'MDI',
        page: 1,
        sort: 'prisonerName',
        order: 'ascending',
      }),
    ).rejects.toThrow('fetch_error')
  })
})
