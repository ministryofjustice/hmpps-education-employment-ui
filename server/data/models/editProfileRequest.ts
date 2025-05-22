import AlreadyInPlaceValue from '../../enums/alreadyInPlaceValue'
import ManageDrugsAndAlcoholValue from '../../enums/manageDrugsAndAlcoholValue'
import CreateProfileRequestArgs from '../prisonerProfile/interfaces/createProfileRequestArgs'
import ProfileDataSection from '../prisonerProfile/interfaces/profileDataSection'
import PrisonerProfile from '../prisonerProfile/interfaces/prisonerProfile'
import TodoItem, { ToDoStatus } from '../prisonerProfile/interfaces/todoItem'
import SupportAcceptedSection from '../prisonerProfile/interfaces/supportAcceptedSection'
import SupportDeclinedSection from '../prisonerProfile/interfaces/supportDeclinedSection'
import ProfileStatus from '../../enums/profileStatus'
import IdentificationValue from '../../enums/identificationValue'

// Model for editing an existing profile and saving via change status or check answers
export default class EditProfileRequest {
  constructor(data: CreateProfileRequestArgs, existingProfile: PrisonerProfile) {
    this.bookingId = existingProfile.bookingId || data.bookingId

    this.profileData = {
      status: data.status,
      prisonName: data.prisonName,
      prisonId: data.prisonId,
      within12Weeks: existingProfile.profileData.within12Weeks,
      supportDeclined: this.buildSupportDeclined(data),
      supportAccepted: this.buildSupportAccepted(data, existingProfile),
    }
  }

  bookingId: number

  profileData: ProfileDataSection

  private buildActions(
    alreadyInPlace: AlreadyInPlaceValue[] = [],
    identification: IdentificationValue[] = [],
    otherIdentification = '',
  ): TodoItem[] {
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
        id: identification,
        other: otherIdentification,
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
            actions: this.buildActions(data.alreadyInPlace, data.identification, data.typeOfIdentificationDetails),
          },
          workImpacts: {
            modifiedBy: data.currentUser,
            modifiedDateTime: isoString,
            abilityToWorkImpactedBy: data.abilityToWork,
            caringResponsibilitiesFullTime: false,
            ableToManageMentalHealth: false,
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

  private buildSupportDeclined(data: CreateProfileRequestArgs): SupportDeclinedSection {
    const now = new Date()
    const isoString = now.toISOString()

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
    if (
      (data.status === ProfileStatus.SUPPORT_NEEDED || data.status === ProfileStatus.READY_TO_WORK) &&
      existingProfile.profileData.supportAccepted
    ) {
      return true
    }

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
