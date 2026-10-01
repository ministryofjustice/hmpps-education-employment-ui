import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMMyyyy } from '../utils/index'

export default class WorkImpactsViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMMyyyy)
  modifiedDateTime: string

  abilityToWorkImpactedBy: string[]

  caringResponsibilitiesFullTime: boolean

  ableToManageMentalHealth: boolean

  ableToManageDependencies: boolean
}
