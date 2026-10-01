import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMMyyyy } from '../utils/index'

export default class WorkExperienceViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMMyyyy)
  modifiedDateTime: string

  workTypesOfInterest: string[]

  workTypesOfInterestOther: string

  jobOfParticularInterest: string
}
