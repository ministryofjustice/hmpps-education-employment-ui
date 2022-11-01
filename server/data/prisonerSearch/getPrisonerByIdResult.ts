export default class GetPrisonerByIdResult {
  prisonerNumber: string

  pncNumber: string

  pncNumberCanonicalShort: string

  pncNumberCanonicalLong: string

  croNumber: string

  bookingId: string

  bookNumber: string

  firstName: string

  middleNames: string

  lastName: string

  dateOfBirth: string

  gender: string

  ethnicity: string

  youthOffender: boolean

  maritalStatus: string

  religion: string

  nationality: string

  status: string

  lastMovementTypeCode: string

  lastMovementReasonCode: string

  inOutStatus: string

  prisonId: string

  prisonName: string

  cellLocation: string

  aliases: [
    {
      firstName: string
      middleNames: string
      lastName: string
      dateOfBirth: string
      gender: string
      ethnicity: string
    },
  ]

  alerts: [
    {
      alertType: string
      alertCode: string
      active: boolean
      expired: boolean
    },
  ]

  csra: string

  category: string

  legalStatus: string

  imprisonmentStatus: string

  imprisonmentStatusDescription: string

  mostSeriousOffence: string

  recall: boolean

  indeterminateSentence: boolean

  sentenceStartDate: string

  releaseDate: string

  confirmedReleaseDate: string

  sentenceExpiryDate: string

  licenceExpiryDate: string

  homeDetentionCurfewEligibilityDate: string

  homeDetentionCurfewActualDate: string

  homeDetentionCurfewEndDate: string

  topupSupervisionStartDate: string

  topupSupervisionExpiryDate: string

  additionalDaysAwarded: number

  nonDtoReleaseDate: string

  nonDtoReleaseDateType: string

  receptionDate: string

  paroleEligibilityDate: string

  automaticReleaseDate: string

  postRecallReleaseDate: string

  conditionalReleaseDate: string

  actualParoleDate: string

  tariffDate: string

  locationDescription: string

  restrictedPatient: boolean

  supportingPrisonId: string

  dischargedHospitalId: string

  dischargedHospitalDescription: string

  dischargeDate: string

  dischargeDetails: string
}
