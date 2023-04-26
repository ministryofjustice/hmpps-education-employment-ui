import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import WorkInterestsViewModel from './workInterestsViewModel'

describe('WorkInterestsViewModel', () => {
  const workInterestsJson = {
    modifiedBy: 'user',
    modifiedDateTime: '2022-04-20T10:00:00.000Z',
    workTypesOfInterest: ['Software Development', 'Data Science'],
    workTypesOfInterestOther: 'Other work interests',
    jobOfParticularInterest: 'Full-stack developer',
  }

  it('transforms JSON to WorkInterestsViewModel instance', () => {
    const workInterestsViewModel = plainToClass(WorkInterestsViewModel, workInterestsJson)

    expect(workInterestsViewModel.modifiedBy).toBe(workInterestsJson.modifiedBy)
    expect(workInterestsViewModel.modifiedDateTime).toBe('20 April')
    expect(workInterestsViewModel.workTypesOfInterest).toEqual(workInterestsJson.workTypesOfInterest)
    expect(workInterestsViewModel.workTypesOfInterestOther).toBe(workInterestsJson.workTypesOfInterestOther)
    expect(workInterestsViewModel.jobOfParticularInterest).toBe(workInterestsJson.jobOfParticularInterest)
  })
})
