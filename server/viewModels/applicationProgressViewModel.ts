import 'reflect-metadata'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'
import ApplicationStatusValue from '../enums/applicationStatusValue'

@Exclude()
export default class ApplicationStatusViewModel {
  jobId: string

  @Expose()
  applicationStatus: ApplicationStatusValue

  @Expose()
  createdByName: string

  @Expose()
  createdByNameDisplay: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  createdByDateTime: string

  @Expose()
  additionalInformation: string
}
