interface PrisonerSearchResultShort {
  prisonerNumber: string
  pncNumber: string
  title: string
  firstName: string
  lastName: string
  prisonId: string
  releaseDate?: string
  confirmedReleaseDate?: string
}

export default interface PrisonerSearchByPrisonIdResponse {
  content: Array<PrisonerSearchResultShort>
  empty?: boolean
  first?: boolean
  last?: boolean
  number?: number
  numberOfElements?: number
  size?: number
  totalElements?: number
}
