import TodoItem from './todoItem'

export default interface UpdatePrisonerProfile {
  bookingId: number

  profileData: {
    status: string

    supportDeclined?: {
      modifiedBy: string
      modifiedDateTime: string
      supportToWorkDeclinedReason: string[]
      supportToWorkDeclinedReasonOther: string
      circumstanceChangesRequiredToWork: string[]
      circumstanceChangesRequiredToWorkOther: string
    }

    supportAccepted?: {
      actionsRequired: {
        modifiedBy: string
        modifiedDateTime: string
        actions: TodoItem[]
      }

      workImpacts: {
        modifiedBy: string
        modifiedDateTime: string
        abilityToWorkImpactedBy: string[]
        caringResponsibilitiesFullTime: boolean
        ableToManageMentalHealth: boolean
        ableToManageDependencies: boolean
      }

      workInterests: {
        modifiedBy: string
        modifiedDateTime: string
        workTypesOfInterest: string[]
        workTypesOfInterestOther: string
        jobOfParticularInterest: string
      }

      workExperience: {
        modifiedBy: string
        modifiedDateTime: string
        previousWorkOrVolunteering: string
        qualificationsAndTraining: string[]
        qualificationsAndTrainingOther: string
      }
    }
  }
}
