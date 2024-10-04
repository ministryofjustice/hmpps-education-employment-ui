import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMMyyyy } from '../utils/index'

@Exclude()
export default class JobClosingSoonViewModel {
  @Expose()
  id: number

  @Expose()
  employerName: string

  @Expose()
  jobTitle: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMMyyyy)
  closingDate: string
}
