import 'reflect-metadata'
import { Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'
import ApplicationStatusValue from '../enums/applicationStatusValue'

@Expose()
export default class ApplicationStatusViewModel {
  status: ApplicationStatusValue

  createdByName: string

  @Type(() => Date)
  @Expose()
  @Transform(formatDateStringToddMMMyyyy)
  createdByDateTime: string

  notes: string
}
