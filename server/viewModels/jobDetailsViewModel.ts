import 'reflect-metadata'
import { Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'

export default class JobViewModel {
  @Expose()
  employerName: string

  @Expose()
  jobTitle: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  closingDate: string

  @Expose()
  distance: string

  @Expose()
  city: string

  @Expose()
  postcode: string

  @Expose()
  typeOfWork: string

  @Expose()
  workPatternName: string

  @Expose()
  salary: string

  @Expose()
  offenceExclusions: string

  @Expose()
  essentialCriteria: string

  @Expose()
  jobDescription: string

  @Expose()
  workPattern: string

  @Expose()
  salaryPeriod: string

  @Expose()
  additionalSalaryInformation: string

  @Expose()
  desirableJobCriteria: string
}
