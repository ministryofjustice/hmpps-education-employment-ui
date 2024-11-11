import { Router } from 'express'
import Controller from './jobsOfInterestController'
import getJobsOfInterestResolver from '../../../middleware/resolvers/getJobsOfInterestResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./jobsOfInterestController')
jest.mock('../../../middleware/resolvers/getProfileByIdResolver')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getJobsOfInterestResolver')
jest.mock('../../../middleware/handleSortMiddleware')

describe('interested jobs routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getJobsOfInterestResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getProfileByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route prisoner list page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/mjma/:id/jobs/interested',
      [
        expect.any(Function), // getProfileByIdResolver
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getPrisonerListjobsOfInterestResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route prisoner list page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/mjma/:id/jobs/interested',
      [
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
