import ProfileStatus from '../../../enums/profileStatus'
import TodoItem from './todoItem'

export default interface PrisonerProfile {
  offenderId: string
  bookingId: number
  createdBy: string
  createdDateTime: string
  modifiedBy: string
  modifiedByName: string
  modifiedDateTime: string
  schemaVersion: string

  profileData: {
    status: ProfileStatus
    prisonName?: string
    prisonId?: string
    within12Weeks?: boolean

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
