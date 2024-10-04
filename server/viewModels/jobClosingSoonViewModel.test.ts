import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import JobClosingSoonViewModel from './jobClosingSoonViewModel'
import TypeOfWorkValue from '../enums/typeOfWorkValue'

describe('JobViewModel', () => {
  const jobViewModelJson = [
    {
      id: 1,
      employerName: 'Amazon',
      jobTitle: 'Forklift operator',
      closingDate: '2022-06-01T17:00:00Z',
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
    const applicationProgressViewModel = plainToClass(JobClosingSoonViewModel, jobViewModelJson)

    // Exposed values
    expect(applicationProgressViewModel.length).toBe(2)
    expect(applicationProgressViewModel[0].id).toBe(jobViewModelJson[0].id)
    expect(applicationProgressViewModel[0].employerName).toBe(jobViewModelJson[0].employerName)
    expect(applicationProgressViewModel[0].closingDate).toBe('01 June 2022')
  })
})
