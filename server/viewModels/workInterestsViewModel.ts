import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMM } from '../utils/utils'

export default class WorkInterestsViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMM)
  modifiedDateTime: string

  workTypesOfInterest: string[]

  workTypesOfInterestOther: string

  jobOfParticularInterest: string
}
