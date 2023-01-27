import { Exclude, Expose, Transform } from 'class-transformer'
import { convertToTitleCase } from '../utils/utils'

@Exclude()
export default class KeyworkerViewModel {
  staffId: number

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  firstName: string

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  lastName: string
}
