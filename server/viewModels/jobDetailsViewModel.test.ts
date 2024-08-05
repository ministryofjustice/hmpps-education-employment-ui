import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import JobDetailsViewModel from './jobDetailsViewModel'
import TypeOfWorkValue from '../enums/typeOfWorkValue'
import Hours from '../enums/hours'
import ExcludingOffences from '../enums/excludingOffences'
import WorkPattern from '../enums/workPattern'

describe('JobViewModel', () => {
  const jobDetailsViewModelJson = {
    id: 1,
    employerName: 'Amazon',
    jobTitle: 'Forklift operator',
    closingDate: '2022-05-01T17:00:00Z',
    distance: 4.1,
    city: 'Leeds',
    postcode: 'LS23 3JF',
    typeOfWork: TypeOfWorkValue.OUTDOOR,
    salaryFrom: 11.93,
    salaryTo: 15.9,
    salaryPeriod: Hours.FULL_TIME,
    offenceExclusions: [ExcludingOffences.ARSON],
    essentialCriteria:
      'Valid forklift operator certification or licence\nProven experience operating a forklift in a warehouse or similar setting\n\nStrong knowledge of forklift safety procedures and best practices\nMaths level 1\nEnglish level 1\nPhysical stamina to perform repetitive tasks and lift heavy objects\nExcellent communication skills and ability to work well in a team environment',
    jobDescription:
      "What's on offer:\n\n5 days over 7, 05:30 to 15:30\nPaid weekly\nImmediate starts available\nFull training provided\nYour duties will include:\n\nManoeuvring forklifts safely in busy industrial environments\nSafely stacking and unstacking large quantities of goods onto shelves or pallets\nMoving goods from storage areas to loading areas for transport\nUnloading deliveries and safely relocating the goods to their designated storage areas\nEnsuring forklift driving areas are free from spills or obstructions\nRegularly checking forklift equipment for faults or damages\nConsolidating partial pallets for incoming goods",
    workPattern: WorkPattern.FLEXIBLE_SHIFTS,
    additionalSalaryInformation: 'Immediate starts available\nFull training provided',
    desirableCriteria:
      'Manoeuvring forklifts safely in busy industrial environments\nSafely stacking and unstacking large quantities of goods onto shelves or pallets\nMoving goods from storage areas to loading areas for transport',
    hoursPerWeek: Hours.FULL_TIME,
    howToApply: 'Email: apply@testcompany.com, send CV and covering letter',
  }

  it('transforms JSON to ApplicationProgressViewModel', () => {
    const jobDetailsViewModel = plainToClass(JobDetailsViewModel, jobDetailsViewModelJson)

    // Exposed values
    expect(jobDetailsViewModel.id).toBe(jobDetailsViewModelJson.id)
    expect(jobDetailsViewModel.employerName).toBe(jobDetailsViewModelJson.employerName)
    expect(jobDetailsViewModel.closingDate).toBe('01 May 2022')
    expect(jobDetailsViewModel.distance).toBe(jobDetailsViewModelJson.distance)
    expect(jobDetailsViewModel.postcode).toBe(jobDetailsViewModelJson.postcode)
    expect(jobDetailsViewModel.typeOfWork).toBe(jobDetailsViewModelJson.typeOfWork)
    expect(jobDetailsViewModel.salaryFrom).toBe(jobDetailsViewModelJson.salaryFrom)
    expect(jobDetailsViewModel.salaryTo).toBe(jobDetailsViewModelJson.salaryTo)
    expect(jobDetailsViewModel.offenceExclusions[0]).toBe(jobDetailsViewModelJson.offenceExclusions[0])
    expect(jobDetailsViewModel.essentialCriteria).toBe(jobDetailsViewModelJson.essentialCriteria)
    expect(jobDetailsViewModel.jobDescription).toBe(jobDetailsViewModelJson.jobDescription)
    expect(jobDetailsViewModel.essentialCriteria).toBe(jobDetailsViewModelJson.essentialCriteria)
    expect(jobDetailsViewModel.workPattern).toBe(jobDetailsViewModelJson.workPattern)
    expect(jobDetailsViewModel.additionalSalaryInformation).toBe(jobDetailsViewModelJson.additionalSalaryInformation)
    expect(jobDetailsViewModel.desirableCriteria).toBe(jobDetailsViewModelJson.desirableCriteria)
    expect(jobDetailsViewModel.hoursPerWeek).toBe(jobDetailsViewModelJson.hoursPerWeek)
    expect(jobDetailsViewModel.howToApply).toBe(jobDetailsViewModelJson.howToApply)
  })
})
