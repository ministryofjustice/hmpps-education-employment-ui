import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import JobViewModel from './jobViewModel'
import TypeOfWorkValue from '../enums/typeOfWorkValue'

describe('JobViewModel', () => {
  const jobViewModelJson = [
    {
      id: 1,
      employerName: 'Amazon',
      jobTitle: 'Forklift operator',
      closingDate: '2022-05-01T17:00:00Z',
      distance: 4.1,
      city: 'Leeds',
      postcode: 'LS23 3JF',
      sector: TypeOfWorkValue.OUTDOOR,
    },
    {
      id: 2,
      employerName: 'Tesco',
      jobTitle: 'Warehouse handler',
      closingDate: '2022-05-02T17:00:00Z',
      distance: 2.3,
      city: 'Leeds',
      postcode: 'LS23 5DH',
      sector: TypeOfWorkValue.CLEANING_AND_MAINTENANCE,
    },
  ]

  it('transforms JSON to ApplicationProgressViewModel', () => {
    const applicationProgressViewModel = plainToClass(JobViewModel, jobViewModelJson)

    // Exposed values
    expect(applicationProgressViewModel.length).toBe(2)
    expect(applicationProgressViewModel[0].id).toBe(jobViewModelJson[0].id)
    expect(applicationProgressViewModel[0].employerName).toBe(jobViewModelJson[0].employerName)
    expect(applicationProgressViewModel[0].closingDate).toBe('01 May 2022')
    expect(applicationProgressViewModel[0].distance).toBe(jobViewModelJson[0].distance)
    expect(applicationProgressViewModel[0].city).toBe(jobViewModelJson[0].city)
    expect(applicationProgressViewModel[0].postcode).toBe(jobViewModelJson[0].postcode)
    expect(applicationProgressViewModel[0].sector).toBe(jobViewModelJson[0].sector)

    expect(applicationProgressViewModel[1].id).toBe(jobViewModelJson[1].id)
    expect(applicationProgressViewModel[1].employerName).toBe(jobViewModelJson[1].employerName)
    expect(applicationProgressViewModel[1].closingDate).toBe('02 May 2022')
    expect(applicationProgressViewModel[1].distance).toBe(jobViewModelJson[1].distance)
    expect(applicationProgressViewModel[1].city).toBe(jobViewModelJson[1].city)
    expect(applicationProgressViewModel[1].postcode).toBe(jobViewModelJson[1].postcode)
    expect(applicationProgressViewModel[1].sector).toBe(jobViewModelJson[1].sector)
  })
})
