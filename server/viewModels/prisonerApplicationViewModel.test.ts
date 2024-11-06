import { plainToClass } from 'class-transformer'
import PrisonerApplicationViewModel from './prisonerApplicationViewModel'

describe('PrisonerApplicationViewModel', () => {
  const prisonerJson = {
    prisonId: 'MDI',
    jobId: 1,
    prisonNumber: 'A1234BC',
    bookingId: '123456',
    firstName: 'JOHN',
    lastName: 'DOE',
    applicationStatus: 'TEST_STATUS',
    jobTitle: 'Job_title',
    employerName: 'Employer_name',
  }

  it('transforms JSON to PrisonerApplicationViewModel instance', () => {
    const prisonerViewModel = plainToClass(PrisonerApplicationViewModel, prisonerJson)

    // Excluded values
    expect(prisonerViewModel.prisonId).toBe(undefined)

    // Included values
    expect(prisonerViewModel.prisonNumber).toBe(prisonerJson.prisonNumber)
    expect(prisonerViewModel.firstName).toBe('John')
    expect(prisonerViewModel.lastName).toBe('Doe')
    expect(prisonerViewModel.applicationStatus).toBe('TEST_STATUS')
    expect(prisonerViewModel.jobTitle).toBe('Job_title')
    expect(prisonerViewModel.employerName).toBe('Employer_name')
  })
})
