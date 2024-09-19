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
      getOtherJobsOfInterest: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getArchivedJobs: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getEmployer: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      createExpressionOfInterest: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      deleteExpressionOfInterest: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      createArchiveRecord: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      deleteArchiveRecord: jest.fn().mockResolvedValue({ data: 'mock_data' }),
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
      jobSectorFilter: 'CATERING',
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
      jobSectorFilter: 'CATERING',
      locationFilter: 'NE24 6FR',
      distanceFilter: 10,
    })
  })

  it('#getJobsOfInterest - should get token and call correct api method', async () => {
    const result = await jobService.getJobsOfInterest('user', {
      offenderNo: 'mockRef',
      page: 1,
      sort: 'distance',
      order: 'acsending',
    })

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.getOtherJobsOfInterest).toHaveBeenCalledWith({
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

  it('#getEmployer - should get token and call correct api method', async () => {
    const result = await jobService.getEmployer('user', 'employerid')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.getEmployer).toHaveBeenCalledWith('employerid')
  })

  it('#createExpressionOfInterest - should get token and call correct api method', async () => {
    const result = await jobService.createExpressionOfInterest('user', 'jobId', 'offenderNo')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.createExpressionOfInterest).toHaveBeenCalledWith('jobId', 'offenderNo')
  })

  it('#deleteExpressionOfInterest - should get token and call correct api method', async () => {
    const result = await jobService.deleteExpressionOfInterest('user', 'jobId', 'offenderNo')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.deleteExpressionOfInterest).toHaveBeenCalledWith('jobId', 'offenderNo')
  })

  it('#createArchiveRecord - should get token and call correct api method', async () => {
    const result = await jobService.createArchiveRecord('user', 'jobId', 'offenderNo')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.createArchiveRecord).toHaveBeenCalledWith('jobId', 'offenderNo')
  })

  it('#deleteArchiveRecord - should get token and call correct api method', async () => {
    const result = await jobService.deleteArchiveRecord('user', 'jobId', 'offenderNo')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApiClientMock.deleteArchiveRecord).toHaveBeenCalledWith('jobId', 'offenderNo')
  })
})
