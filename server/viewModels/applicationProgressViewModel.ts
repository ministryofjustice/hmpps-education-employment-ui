import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'
import ApplicationStatusValue from '../enums/applicationStatusValue'

@Exclude()
export default class ApplicationStatusViewModel {
  @Expose()
  id: string

  jobId: string

  @Expose()
  applicationStatus: ApplicationStatusValue

  @Expose()
  modifiedBy: string

  @Expose()
  modifiedByNameDisplay: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  modifiedAt: string

  @Expose()
  additionalInformation: string
}
