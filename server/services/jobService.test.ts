/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApiClient from '../data/jobApi/jobApiClient'
import JobService from './jobService'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/jobApi/jobApiClient')

describe('PrisonService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let jobApiClientMock: jest.Mocked<JobApiClient>
  let jobService: JobService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    jobApiClientMock = {
      getJobDetails: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getMatchedJobs: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getFlaggedJobs: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getArchivedJobs: jest.fn().mockResolvedValue({ data: 'mock_data' }),
    } as unknown as jest.Mocked<JobApiClient>
    ;(JobApiClient as any).mockImplementation(() => jobApiClientMock)

    jobService = new JobService(hmppsAuthClientMock)
  })

  it('#getMatchedJobs - should get token and call correct api method', async () => {
    const result = await jobService.getMatchedJobs('user', {
      offenderNo: 'mockRef',
      page: 1,
      sort: 'distance',
      order: 'acsending',
      typeOfWorkFilter: 'CATERING',
      locationFilter: 'NE24 6FR',
      distanceFilter: 10,
    })

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.getMatchedJobs).toHaveBeenCalledWith({
      offenderNo: 'mockRef',
      page: 1,
      sort: 'distance',
      order: 'acsending',
      typeOfWorkFilter: 'CATERING',
      locationFilter: 'NE24 6FR',
      distanceFilter: 10,
    })
  })

  it('#getFlaggedJobs - should get token and call correct api method', async () => {
    const result = await jobService.getFlaggedJobs('user', {
      offenderNo: 'mockRef',
      page: 1,
      sort: 'distance',
      order: 'acsending',
    })

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.getFlaggedJobs).toHaveBeenCalledWith({
      offenderNo: 'mockRef',
      page: 1,
      sort: 'distance',
      order: 'acsending',
    })
  })

  it('#getArchivedJobs - should get token and call correct api method', async () => {
    const result = await jobService.getArchivedJobs('user', {
      offenderNo: 'mockRef',
      page: 1,
      sort: 'distance',
      order: 'acsending',
    })

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.getArchivedJobs).toHaveBeenCalledWith({
      offenderNo: 'mockRef',
      page: 1,
      sort: 'distance',
      order: 'acsending',
    })
  })

  it('#getJobDetails - should get token and call correct api method', async () => {
    const result = await jobService.getJobDetails('user', 'offenderId')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.getJobDetails).toHaveBeenCalledWith('offenderId', undefined)
  })
})
