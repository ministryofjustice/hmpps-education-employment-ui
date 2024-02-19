import type { Router } from 'express'

import CandidateMatchingController from './candidateMatchingController'
import getCandidateMatchingResolver from '../../middleware/resolvers/getCandidateMatchingResolver'
import type { Services } from '../../services'

export default (router: Router, services: Services) => {
  const controller = new CandidateMatchingController()

  router.get('/candidateMatching', getCandidateMatchingResolver(services.candidateMatchingService), controller.get)
}
