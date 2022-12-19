import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMM } from '../utils/utils'

export default class WorkImpactsViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMM)
  modifiedDateTime: string

  abilityToWorkImpactedBy: string[]

  caringResponsibilitiesFullTime: boolean

  ableToManageMentalHealth: boolean

  ableToManageDependencies: boolean
}
