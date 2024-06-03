import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'
import ApplicationStatusValue from '../enums/applicationStatusValue'

@Exclude()
export default class ApplicationStatusViewModel {
  jobId: string

  @Expose()
  status: ApplicationStatusValue

  @Expose()
  createdByName: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  createdByDateTime: string

  @Expose()
  notes: string
}
