import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMM } from '../utils/utils'

export default class SupportDeclinedSectionViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMM)
  modifiedDateTime: string

  supportToWorkDeclinedReason: string[]

  supportToWorkDeclinedReasonOther: string

  circumstanceChangesRequiredToWork: string[]

  circumstanceChangesRequiredToWorkOther: string
}
