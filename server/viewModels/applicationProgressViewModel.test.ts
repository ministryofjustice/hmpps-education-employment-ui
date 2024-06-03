import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import ApplicationProgressViewModel from './applicationProgressViewModel'
import ApplicationStatusValue from '../enums/applicationStatusValue'

describe('ActivityViewModel', () => {
  const applicationProgressJson = [
    {
      jobId: 'test_id',
      status: ApplicationStatusValue.APPLICATION_MADE,
      createdByName: 'TEST_USER',
      createdByDateTime: '2022-05-01T17:00:00Z',
      notes: 'Some notes',
      someValue: 'Some value',
    },
    {
      jobId: 'test_id',
      status: ApplicationStatusValue.INTERVIEW_BOOKED,
      createdByName: 'TEST_USER',
      createdByDateTime: '2022-05-02T17:00:00Z',
      notes: 'Some more notes',
    },
  ]

  it('transforms JSON to ApplicationProgressViewModel', () => {
    const applicationProgressViewModel = plainToClass(ApplicationProgressViewModel, applicationProgressJson)

    // Excluded values
    expect(applicationProgressViewModel[0].jobId).toBe(undefined)

    // Exposed values
    expect(applicationProgressViewModel.length).toBe(2)
    expect(applicationProgressViewModel[0].status).toBe(applicationProgressJson[0].status)
    expect(applicationProgressViewModel[0].createdByName).toBe(applicationProgressJson[0].createdByName)
    expect(applicationProgressViewModel[0].createdByDateTime).toBe('01 May 2022')
    expect(applicationProgressViewModel[0].notes).toBe(applicationProgressJson[0].notes)

    expect(applicationProgressViewModel[1].status).toBe(applicationProgressJson[1].status)
    expect(applicationProgressViewModel[1].createdByName).toBe(applicationProgressJson[1].createdByName)
    expect(applicationProgressViewModel[1].createdByDateTime).toBe('02 May 2022')
    expect(applicationProgressViewModel[1].notes).toBe(applicationProgressJson[1].notes)
  })
})
