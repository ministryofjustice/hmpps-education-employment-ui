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
  sector: string

  @Expose()
  hasExpressedInterest: boolean

  @Expose()
  isNational: boolean

  @Expose()
  numberOfVacancies: number
}
