import AbilityToWorkValue from '../../enums/abilityToWorkValue'
import AlreadyInPlaceValue from '../../enums/alreadyInPlaceValue'
import IdentificationValue from '../../enums/identificationValue'
import ManageDrugsAndAlcoholValue from '../../enums/manageDrugsAndAlcoholValue'
import ProfileStatus from '../../enums/profileStatus'
import SupportDeclinedReasonValue from '../../enums/supportDeclinedReasonValue'
import TrainingAndQualificationsValue from '../../enums/trainingAndQualificationsValue'
import TypeOfWorkValue from '../../enums/typeOfWorkValue'
import WhatNeedsToChangeValue from '../../enums/whatNeedsToChangeValue'
import YesNoValue from '../../enums/yesNoValue'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CreateProfileRequestArgs {
  prisonerId: string
  bookingId: number
  status: ProfileStatus
  currentUser: string
  supportOptIn?: YesNoValue
  rightToWork?: YesNoValue

  // Support declined fields
  supportDeclinedReason?: SupportDeclinedReasonValue[]
  supportDeclinedDetails?: string
  whatNeedsToChange?: WhatNeedsToChangeValue[]
  whatNeedsToChangeDetails?: string

  // Support accepted fields
  alreadyInPlace?: AlreadyInPlaceValue[]
  identification?: IdentificationValue[]
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

interface CreateProfileRequestProfileSection {
  status: ProfileStatus
  supportDeclined: any
  supportAccepted: any
}

interface TodoItem {
  todoItem: AlreadyInPlaceValue
  status: ToDoStatus
}

enum ToDoStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateProfileRequest {
  constructor(data: CreateProfileRequestArgs) {
    const now = new Date()
    const isoString = now.toISOString()

    this.bookingId = data.bookingId

    this.profileData = {
      status: data.status,
      supportDeclined:
        data.supportOptIn === YesNoValue.NO
          ? {
              modifiedBy: data.currentUser,
              modifiedDateTime: isoString,
              supportToWorkDeclinedReason: data.supportDeclinedReason,
              supportToWorkDeclinedReasonOther: data.supportDeclinedDetails,
              circumstanceChangesRequiredToWork: data.whatNeedsToChange,
              circumstanceChangesRequiredToWorkOther: data.whatNeedsToChangeDetails,
            }
          : null,
      supportAccepted:
        data.supportOptIn === YesNoValue.YES
          ? {
              actionsRequired: {
                modifiedBy: data.currentUser,
                modifiedDateTime: isoString,
                actions: this.buildActions(data.alreadyInPlace),
              },
              workImpacts: {
                modifiedBy: data.currentUser,
                modifiedDateTime: isoString,
                abilityToWorkImpactedBy: data.abilityToWork,
                caringResponsibilitiesFullTime: false,
                ableToManageMentalHealth: true,
                ableToManageDependencies: data.manageDrugsAndAlcohol === ManageDrugsAndAlcoholValue.ABLE_TO_MANAGE,
              },
              workInterests: {
                modifiedBy: data.currentUser,
                modifiedDateTime: isoString,
                workTypesOfInterest: data.typeOfWork,
                workTypesOfInterestOther: data.typeOfWorkDetails,
                jobOfParticularInterest: data.jobOfParticularInterestDetails || '',
              },
              workExperience: {
                modifiedBy: data.currentUser,
                modifiedDateTime: isoString,
                previousWorkOrVolunteering: data.workExperienceDetails || '',
                qualificationsAndTraining: data.trainingAndQualifications,
                qualificationsAndTrainingOther: data.trainingAndQualificationsDetails,
              },
            }
          : null,
    }
  }

  bookingId: number

  profileData: CreateProfileRequestProfileSection

  private buildActions(alreadyInPlace: AlreadyInPlaceValue[] = []): TodoItem[] {
    return [
      {
        todoItem: AlreadyInPlaceValue.BANK_ACCOUNT,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.BANK_ACCOUNT)
          ? ToDoStatus.COMPLETED
          : ToDoStatus.NOT_STARTED,
      },
      {
        todoItem: AlreadyInPlaceValue.CV_AND_COVERING_LETTER,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.CV_AND_COVERING_LETTER)
          ? ToDoStatus.COMPLETED
          : ToDoStatus.NOT_STARTED,
      },
      {
        todoItem: AlreadyInPlaceValue.DISCLOSURE_LETTER,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.DISCLOSURE_LETTER)
          ? ToDoStatus.COMPLETED
          : ToDoStatus.NOT_STARTED,
      },
      {
        todoItem: AlreadyInPlaceValue.EMAIL_OR_PHONE,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.EMAIL_OR_PHONE)
          ? ToDoStatus.COMPLETED
          : ToDoStatus.NOT_STARTED,
      },
      {
        todoItem: AlreadyInPlaceValue.HOUSING,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.HOUSING) ? ToDoStatus.COMPLETED : ToDoStatus.NOT_STARTED,
      },
      {
        todoItem: AlreadyInPlaceValue.ID,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.ID) ? ToDoStatus.COMPLETED : ToDoStatus.NOT_STARTED,
      },
    ]
  }
}
