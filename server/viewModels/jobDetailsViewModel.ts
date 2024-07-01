import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'

@Exclude()
export default class JobViewModel {
  @Expose()
  id: number

  @Expose()
  employerName: string

  @Expose()
  jobTitle: string

  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  @Expose()
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
  workPattern: string

  @Expose()
  workPatternName: string

  @Expose()
  offenceExclusions: string[]

  @Expose()
  essentialCriteria: string[]

  @Expose()
  desirableCriteria: string[]

  @Expose()
  jobDescription: string

  @Expose()
  salaryFrom: number

  @Expose()
  salaryTo: number

  @Expose()
  salaryPeriod: string

  @Expose()
  additionalSalaryInformation: string

  @Expose()
  hours: string

  @Expose()
  howToApply: string
}
