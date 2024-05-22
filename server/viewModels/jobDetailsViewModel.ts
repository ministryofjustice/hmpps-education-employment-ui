import 'reflect-metadata'
import { Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'

@Expose()
export default class JobViewModel {
  employerName: string

  jobTitle: string

  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  closingDate: string

  distance: string

  city: string

  postcode: string

  typeOfWork: string

  workPattern: string

  workPatternName: string

  offenceExclusions: string[]

  essentialCriteria: string[]

  desirableCriteria: string[]

  jobDescription: string

  salary: string

  salaryPeriod: string

  additionalSalaryInformation: string
}
