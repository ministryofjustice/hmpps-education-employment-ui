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

  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  @Expose()
  startDate: string

  @Expose()
  distance: string

  @Expose()
  postcode: string

  @Expose()
  description: string

  @Expose()
  sector: string

  @Expose()
  workPattern: string

  @Expose()
  contractType: string

  @Expose()
  offenceExclusions: string[]

  @Expose()
  offenceExclusionsDetails: string

  @Expose()
  essentialCriteria: string

  @Expose()
  desirableCriteria: string

  @Expose()
  salaryFrom: number

  @Expose()
  salaryTo: number

  @Expose()
  salaryPeriod: string

  @Expose()
  additionalSalaryInformation: string

  @Expose()
  hoursPerWeek: string

  @Expose()
  howToApply: string

  @Expose()
  isOnlyForPrisonLeavers: boolean

  @Expose()
  numberOfVacancies: number

  @Expose()
  charityName: string

  @Expose()
  archived: boolean

  @Expose()
  expressionOfInterest: boolean
}
