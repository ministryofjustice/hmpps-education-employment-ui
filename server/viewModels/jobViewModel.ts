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
}
