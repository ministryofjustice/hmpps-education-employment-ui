import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'
import IdentificationValue from '../../../enums/identificationValue'
import ManageDrugsAndAlcoholValue from '../../../enums/manageDrugsAndAlcoholValue'
import ProfileStatus from '../../../enums/profileStatus'
import SupportDeclinedReasonValue from '../../../enums/supportDeclinedReasonValue'
import TrainingAndQualificationsValue from '../../../enums/trainingAndQualificationsValue'
import TypeOfWorkValue from '../../../enums/typeOfWorkValue'
import WhatNeedsToChangeValue from '../../../enums/whatNeedsToChangeValue'
import YesNoValue from '../../../enums/yesNoValue'

export default interface CreateProfileRequestArgs {
  prisonerId: string
  bookingId: number
  status: ProfileStatus
  currentUser: string
  supportOptIn?: YesNoValue
  rightToWork?: YesNoValue
  prisonName?: string
  prisonId?: string

  // Support declined fields
  supportDeclinedReason?: SupportDeclinedReasonValue[]
  supportDeclinedDetails?: string
  whatNeedsToChange?: WhatNeedsToChangeValue[]
  whatNeedsToChangeDetails?: string

  // Support accepted fields
  alreadyInPlace?: AlreadyInPlaceValue[]
  identification?: IdentificationValue[]
  typeOfIdentificationDetails?: string
  abilityToWork?: AbilityToWorkValue[]
  manageDrugsAndAlcohol?: ManageDrugsAndAlcoholValue
  typeOfWork?: TypeOfWorkValue[]
  typeOfWorkDetails?: string
  jobOfParticularInterest?: YesNoValue
  jobOfParticularInterestDetails?: string
  workExperience?: YesNoValue
  workExperienceDetails?: string
  trainingAndQualifications?: TrainingAndQualificationsValue[]
  trainingAndQualificationsDetails?: string
}
