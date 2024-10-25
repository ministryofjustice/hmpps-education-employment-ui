// Required import for jest
import 'reflect-metadata'
import { Exclude, Expose, Transform } from 'class-transformer'

import convertToTitleCase from '../utils/convertToTitleCase'

// Exclude all by default expose properties when needed
@Exclude()
export default class PrisonerApplicationViewModel {
  prisonId: string

  @Expose()
  jobId: number

  @Expose()
  jobTitle: string

  @Expose()
  employerName: string

  @Expose()
  prisonNumber: string

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  firstName: string

  @Expose()
  @Transform(({ value }) => convertToTitleCase(value))
  lastName: string

  @Expose()
  applicationStatus: string
}
