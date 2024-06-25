import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyyHHmmAsArray } from '../utils/utils'

@Exclude()
export default class NotesViewModel {
  @Expose()
  createdBy: string

  @Expose()
  createdName: string

  @Type(() => Array)
  @Expose()
  @Transform(formatDateStringToddMMMyyyyHHmmAsArray)
  createdDateTime: string

  @Expose()
  attribute: string

  @Expose()
  text: string
}
