import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMMyyyy } from '../utils/index'

export default class SupportDeclinedSectionViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMMyyyy)
  modifiedDateTime: string

  supportToWorkDeclinedReason: string[]

  supportToWorkDeclinedReasonOther: string

  circumstanceChangesRequiredToWork: string[]

  circumstanceChangesRequiredToWorkOther: string
}
