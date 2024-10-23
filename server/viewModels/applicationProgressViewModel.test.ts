import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import ApplicationProgressViewModel from './applicationProgressViewModel'
import ApplicationStatusValue from '../enums/applicationStatusValue'

describe('ActivityViewModel', () => {
  const applicationProgressJson = [
    {
      id: 'ab5c4b40-f2f0-4ae1-a34f-383ecf845ea2',
      jobId: 'test_id',
      applicationStatus: ApplicationStatusValue.APPLICATION_MADE,
      modifiedBy: 'TEST_USER',
      modifiedAt: '2022-05-01T17:00:00Z',
      additionalInformation: 'Some notes',
      someValue: 'Some value',
    },
    {
      id: 'ab5c4b40-f2f0-4ae1-a34f-383ecf845ea2',
      jobId: 'test_id',
      applicationStatus: ApplicationStatusValue.INTERVIEW_BOOKED,
      modifiedBy: 'TEST_USER',
      modifiedAt: '2022-05-02T17:00:00Z',
      additionalInformation: 'Some more notes',
    },
  ]

  it('transforms JSON to ApplicationProgressViewModel', () => {
    const applicationProgressViewModel = plainToClass(ApplicationProgressViewModel, applicationProgressJson)

    // Excluded values
    expect(applicationProgressViewModel[0].jobId).toBe(undefined)

    // Exposed values
    expect(applicationProgressViewModel.length).toBe(2)
    expect(applicationProgressViewModel[0].id).toBe(applicationProgressJson[0].id)
    expect(applicationProgressViewModel[0].applicationStatus).toBe(applicationProgressJson[0].applicationStatus)
    expect(applicationProgressViewModel[0].modifiedBy).toBe(applicationProgressJson[0].modifiedBy)
    expect(applicationProgressViewModel[0].modifiedAt).toBe('01 May 2022')
    expect(applicationProgressViewModel[0].additionalInformation).toBe(applicationProgressJson[0].additionalInformation)

    expect(applicationProgressViewModel[1].id).toBe(applicationProgressJson[1].id)
    expect(applicationProgressViewModel[1].applicationStatus).toBe(applicationProgressJson[1].applicationStatus)
    expect(applicationProgressViewModel[1].modifiedBy).toBe(applicationProgressJson[1].modifiedBy)
    expect(applicationProgressViewModel[1].modifiedAt).toBe('02 May 2022')
    expect(applicationProgressViewModel[1].additionalInformation).toBe(applicationProgressJson[1].additionalInformation)
  })
})
