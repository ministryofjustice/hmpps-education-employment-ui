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

  workPatternName: string

  salary: string

  offenceExclusions: string

  essentialCriteria: string

  jobDescription: string

  workPattern: string

  salaryPeriod: string

  additionalSalaryInformation: string

  desirableJobCriteria: string
}
