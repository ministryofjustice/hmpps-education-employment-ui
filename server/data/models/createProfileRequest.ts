import AlreadyInPlaceValue from '../../enums/alreadyInPlaceValue'
import IdentificationValue from '../../enums/identificationValue'
import ManageDrugsAndAlcoholValue from '../../enums/manageDrugsAndAlcoholValue'
import YesNoValue from '../../enums/yesNoValue'
import CreateProfileRequestArgs from '../prisonerProfile/interfaces/createProfileRequestArgs'
import ProfileDataSection from '../prisonerProfile/interfaces/profileDataSection'
import TodoItem, { ToDoStatus } from '../prisonerProfile/interfaces/todoItem'

// Model to use for creating a profile from scratch
export default class CreateProfileRequest {
  constructor(data: CreateProfileRequestArgs) {
    const now = new Date()
    const isoString = now.toISOString()

    this.bookingId = data.bookingId

    this.profileData = {
      status: data.status,
      prisonName: data.prisonName,
      prisonId: data.prisonId,
      within12Weeks: data.within12Weeks,
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
          : null,
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
}
