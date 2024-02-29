import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMM } from '../utils/index'

export default class WorkExperienceViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMM)
  modifiedDateTime: string

  workTypesOfInterest: string[]

  workTypesOfInterestOther: string

  jobOfParticularInterest: string
}
