import type { Router } from 'express'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'

import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import type { Services } from '../../../services'
import TrainingAndQualificationsController from './trainingAndQualifications'

export default (router: Router, services: Services) => {
  const controller = new TrainingAndQualificationsController()

  router.get(
    '/work-profile/create/:id/training-and-qualifications/:mode',
    [getPrisonerByIdResolver(services.prisonerSearch)],
    controller.get,
  )
  router.post(
    '/work-profile/create/:id/training-and-qualifications/:mode',
    [parseCheckBoxValue('trainingAndQualifications')],
    controller.post,
  )
}
