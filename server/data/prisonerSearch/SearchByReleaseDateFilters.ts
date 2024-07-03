import { Expose, Transform } from 'class-transformer'
import { transformUTCDate } from '../../utils/index'

export default class SearchByReleaseDateFilters {
  @Expose()
  prisonId: string

  @Expose()
  @Transform(transformUTCDate)
  earliestReleaseDate?: Date

  @Expose()
  @Transform(transformUTCDate)
  latestReleaseDate?: Date
}
