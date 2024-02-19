import { Router } from 'express'
import Controller from './candidateMatchingController'
import getCandidateMatchingResolver from '../../middleware/resolvers/getCandidateMatchingResolver'
import { Services } from '../../services'
import routes from './index'

jest.mock('./candidateMatchingController')
jest.mock('../../middleware/resolvers/getCandidateMatchingResolver')

describe('Candidate matching routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn() } as unknown as Router
    services = {
      candidateMatchingService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
    }))
    ;(getCandidateMatchingResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for home page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/candidateMatching',
      expect.any(Function), // getCandidateMatchingResolver
      expect.any(Function), // controller.get
    )
  })
})
