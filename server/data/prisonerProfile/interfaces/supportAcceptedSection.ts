import TodoItem from './todoItem'

export default interface SupportAcceptedSection {
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
