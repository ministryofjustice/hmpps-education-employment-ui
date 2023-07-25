import AbilityToWorkValue from '../../enums/abilityToWorkValue'
import AlreadyInPlaceValue from '../../enums/alreadyInPlaceValue'
import ManageDrugsAndAlcoholValue from '../../enums/manageDrugsAndAlcoholValue'
import CreateProfileRequestArgs from './interfaces/createProfileRequestArgs'
import ProfileDataSection from './interfaces/profileDataSection'
import PrisonerProfile from './interfaces/prisonerProfile'
import TodoItem, { ToDoStatus } from './interfaces/todoItem'
import SupportAcceptedSection from './interfaces/supportAcceptedSection'
import SupportDeclinedSection from './interfaces/supportDeclinedSection'
import ProfileStatus from '../../enums/profileStatus'

export default class UpdateProfileRequest {
  constructor(data: CreateProfileRequestArgs, existingProfile: PrisonerProfile) {
    this.bookingId = existingProfile.bookingId || data.bookingId

    this.profileData = {
      status: data.status,
      supportDeclined: this.buildSupportDeclined(data, existingProfile),
      supportAccepted: this.buildSupportAccepted(data, existingProfile),
    }
  }

  bookingId: number

  profileData: ProfileDataSection

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
        todoItem: AlreadyInPlaceValue.EMAIL,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.EMAIL) ? ToDoStatus.COMPLETED : ToDoStatus.NOT_STARTED,
      },
      {
        todoItem: AlreadyInPlaceValue.PHONE,
        status: alreadyInPlace.includes(AlreadyInPlaceValue.PHONE) ? ToDoStatus.COMPLETED : ToDoStatus.NOT_STARTED,
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

  private buildSupportAccepted(
    data: CreateProfileRequestArgs,
    existingProfile: PrisonerProfile,
  ): SupportAcceptedSection {
    const now = new Date()
    const isoString = now.toISOString()

    return data.status === ProfileStatus.SUPPORT_DECLINED || this.isStatusOnlyChange(data, existingProfile)
      ? existingProfile.profileData.supportAccepted
      : {
          actionsRequired: {
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
            actions: this.buildActions(data.alreadyInPlace),
          },
          workImpacts: {
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
            abilityToWorkImpactedBy: data.abilityToWork,
            caringResponsibilitiesFullTime: data.abilityToWork.includes(AbilityToWorkValue.FAMILY_ISSUES),
            ableToManageMentalHealth: data.abilityToWork.includes(AbilityToWorkValue.MENTAL_HEALTH_ISSUES) === false,
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
  }

  private buildSupportDeclined(
    data: CreateProfileRequestArgs,
    existingProfile: PrisonerProfile,
  ): SupportDeclinedSection {
    const now = new Date()
    const isoString = now.toISOString()

    if (this.isStatusOnlyChange(data, existingProfile)) {
      return existingProfile.profileData.supportDeclined
    }

    return data.status !== ProfileStatus.SUPPORT_DECLINED
      ? null
      : {
          modifiedBy: data.currentUser,
          modifiedDateTime: isoString,
          supportToWorkDeclinedReason: data.supportDeclinedReason,
          supportToWorkDeclinedReasonOther: data.supportDeclinedDetails,
          circumstanceChangesRequiredToWork: data.whatNeedsToChange,
          circumstanceChangesRequiredToWorkOther: data.whatNeedsToChangeDetails,
        }
  }

  private isStatusOnlyChange(data: CreateProfileRequestArgs, existingProfile: PrisonerProfile) {
    if (data.status === ProfileStatus.NO_RIGHT_TO_WORK) {
      return true
    }

    if (existingProfile.profileData.status === ProfileStatus.READY_TO_WORK) {
      if (data.status === ProfileStatus.SUPPORT_NEEDED) {
        return true
      }
    }

    if (existingProfile.profileData.status === ProfileStatus.SUPPORT_NEEDED) {
      if (data.status === ProfileStatus.READY_TO_WORK) {
        return true
      }
    }

    return false
  }
}
