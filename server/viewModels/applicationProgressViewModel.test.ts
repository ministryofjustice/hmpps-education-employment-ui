import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import ApplicationProgressViewModel from './applicationProgressViewModel'
import ApplicationStatusValue from '../enums/applicationStatusValue'

describe('ActivityViewModel', () => {
  const applicationProgressJson = [
    {
      jobId: 'test_id',
      applicationStatus: ApplicationStatusValue.APPLICATION_MADE,
      createdByName: 'TEST_USER',
      createdByDateTime: '2022-05-01T17:00:00Z',
      additionalInformation: 'Some notes',
      someValue: 'Some value',
    },
    {
      jobId: 'test_id',
      applicationStatus: ApplicationStatusValue.INTERVIEW_BOOKED,
      createdByName: 'TEST_USER',
      createdByDateTime: '2022-05-02T17:00:00Z',
      additionalInformation: 'Some more notes',
    },
  ]

  it('transforms JSON to ApplicationProgressViewModel', () => {
    const applicationProgressViewModel = plainToClass(ApplicationProgressViewModel, applicationProgressJson)

    // Excluded values
    expect(applicationProgressViewModel[0].jobId).toBe(undefined)

    // Exposed values
    expect(applicationProgressViewModel.length).toBe(2)
    expect(applicationProgressViewModel[0].applicationStatus).toBe(applicationProgressJson[0].applicationStatus)
    expect(applicationProgressViewModel[0].createdByName).toBe(applicationProgressJson[0].createdByName)
    expect(applicationProgressViewModel[0].createdByDateTime).toBe('01 May 2022')
    expect(applicationProgressViewModel[0].additionalInformation).toBe(applicationProgressJson[0].additionalInformation)

    expect(applicationProgressViewModel[1].applicationStatus).toBe(applicationProgressJson[1].applicationStatus)
    expect(applicationProgressViewModel[1].createdByName).toBe(applicationProgressJson[1].createdByName)
    expect(applicationProgressViewModel[1].createdByDateTime).toBe('02 May 2022')
    expect(applicationProgressViewModel[1].additionalInformation).toBe(applicationProgressJson[1].additionalInformation)
  })
})
