import Page from './page'

export type PageElement = Cypress.Chainable<JQuery>

export default class CheckYourAnswersPage extends Page {
  rightToWork = (): PageElement => cy.get('[data-qa=rightToWork]')

  supportOptIn = (): PageElement => cy.get('[data-qa=supportOptIn]')

  alreadyInPlace = (): PageElement => cy.get('[data-qa=alreadyInPlace]')

  identification = (): PageElement => cy.get('[data-qa=identification]')

  manageDrugsAndAlcohol = (): PageElement => cy.get('[data-qa=manageDrugsAndAlcohol]')

  typeOfWork = (): PageElement => cy.get('[data-qa=typeOfWork]')

  abilityToWork = (): PageElement => cy.get('[data-qa=abilityToWork]')

  jobOfParticularInterest = (): PageElement => cy.get('[data-qa=jobOfParticularInterest]')

  workExperience = (): PageElement => cy.get('[data-qa=workExperience]')

  supportDeclinedReason = (): PageElement => cy.get('[data-qa=supportDeclinedReason]')

  whatNeedsToChange = (): PageElement => cy.get('[data-qa=whatNeedsToChange]')

  trainingAndQualifications = (): PageElement => cy.get('[data-qa=trainingAndQualifications]')

  rightToWorkLink = (): PageElement => cy.get('[data-qa=rightToWorkLink]')

  supportOptInLink = (): PageElement => cy.get('[data-qa=supportOptInLink]')

  alreadyInPlaceLink = (): PageElement => cy.get('[data-qa=alreadyInPlaceLink]')

  identificationLink = (): PageElement => cy.get('[data-qa=identificationLink]')

  manageDrugsAndAlcoholLink = (): PageElement => cy.get('[data-qa=manageDrugsAndAlcoholLink]')

  typeOfWorkLink = (): PageElement => cy.get('[data-qa=typeOfWorkLink]')

  abilityToWorkLink = (): PageElement => cy.get('[data-qa=abilityToWorkLink]')

  jobOfParticularInterestLink = (): PageElement => cy.get('[data-qa=jobOfParticularInterestLink]')

  workExperienceLink = (): PageElement => cy.get('[data-qa=workExperienceLink]')

  supportDeclinedReasonLink = (): PageElement => cy.get('[data-qa=supportDeclinedReasonLink]')

  whatNeedsToChangeLink = (): PageElement => cy.get('[data-qa=whatNeedsToChangeLink]')

  trainingAndQualificationsLink = (): PageElement => cy.get('[data-qa=trainingAndQualificationsLink]')
}
