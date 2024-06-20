/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApplicationApiClient from '../data/jobApplicationApi/jobApplicationApiClient'
import ApplicationStatusValue from '../enums/applicationStatusValue'
import JobApplicationService from './jobApplicationService'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/jobApplicationApi/jobApplicationApiClient')

describe('JobApplicationService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let jobApplicationApiClient: jest.Mocked<JobApplicationApiClient>
  let jobApplicationService: JobApplicationService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    jobApplicationApiClient = {
      getOpenApplications: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getClosedApplications: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      getApplicationProgress: jest.fn().mockResolvedValue({ data: 'mock_data' }),
      updateApplicationProgress: jest.fn().mockResolvedValue({ data: 'mock_data' }),
    } as unknown as jest.Mocked<JobApplicationApiClient>
    ;(JobApplicationApiClient as any).mockImplementation(() => jobApplicationApiClient)

    jobApplicationService = new JobApplicationService(hmppsAuthClientMock)
  })

  it('#getOpenApplications - should get token and call correct api method', async () => {
    const result = await jobApplicationService.getOpenApplications('user', 'offenderId')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApplicationApiClient.getOpenApplications).toHaveBeenCalledWith('offenderId')
  })

  it('#getClosedApplications - should get token and call correct api method', async () => {
    const result = await jobApplicationService.getClosedApplications('user', 'offenderId')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApplicationApiClient.getClosedApplications).toHaveBeenCalledWith('offenderId')
  })

  it('#getApplicationProgress - should get token and call correct api method', async () => {
    const result = await jobApplicationService.getApplicationProgress('user', 'offenderId', 'jobId')

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApplicationApiClient.getApplicationProgress).toHaveBeenCalledWith('offenderId', 'jobId')
  })

  it('#updateApplicationProgress - should get token and call correct api method', async () => {
    const result = await jobApplicationService.updateApplicationProgress('user', {
      offenderNo: 'offenderId',
      prisonId: 'MDI',
      firstName: 'JOE',
      lastName: 'BlOGS',
      jobId: 1,
      applicationStatus: ApplicationStatusValue.APPLICATION_MADE,
      additionalInformation: '',
    })

    expect(result).toEqual({ data: 'mock_data' })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(jobApplicationApiClient.updateApplicationProgress).toHaveBeenCalledWith({
      additionalInformation: '',
      applicationStatus: 'APPLICATION_MADE',
      firstName: 'JOE',
      jobId: 1,
      lastName: 'BlOGS',
      offenderNo: 'offenderId',
      prisonId: 'MDI',
    })
  })
})
