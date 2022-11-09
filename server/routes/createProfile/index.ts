import type { Router } from 'express'

import type { Services } from '../../services'
import rightToWorkRoutes from './rightToWork'
import ineligableToWorkRoutes from './ineligableToWork'
import supportOptInRoutes from './supportOptIn'
import supportDeclinedReasonRoutes from './supportDeclinedReason'
import whatNeedsToChangeRoutes from './whatNeedsToChange'
import alreadyInPlaceRoutes from './alreadyInPlace'
import abilityToWorkRoutes from './abilityToWork'
import manageDrugsAndAlcoholRoutes from './manageDrugsAndAlcohol'
import typeOfWorkRoutes from './typeOfWork'
import jobOfParticularInterestRoutes from './jobOfParticularInterest'
import workExperienceRoutes from './workExperience'

export default (router: Router, services: Services) => {
  rightToWorkRoutes(router, services)
  ineligableToWorkRoutes(router, services)
  supportOptInRoutes(router, services)
  supportDeclinedReasonRoutes(router, services)
  whatNeedsToChangeRoutes(router, services)
  alreadyInPlaceRoutes(router, services)
  abilityToWorkRoutes(router, services)
  manageDrugsAndAlcoholRoutes(router, services)
  typeOfWorkRoutes(router, services)
  jobOfParticularInterestRoutes(router, services)
  workExperienceRoutes(router, services)
}
