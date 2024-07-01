import { Router } from 'express'
import Controller from './jobDetailsController'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getPrisonerAddressByIdResolver from '../../../middleware/resolvers/getPrisonerAddressByIdResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./jobDetailsController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getProfileByIdResolver')
jest.mock('../../../middleware/resolvers/getJobDetailsResolver')
jest.mock('../../../middleware/resolvers/getPrisonerAddressByIdResolver')

describe('Right to work routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerProfileService: {},
      prisonerSearchService: {},
      jobService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getProfileByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getJobDetailsResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getPrisonerAddressByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/cms/:id/job/:jobId/details',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getProfileByIdResolver
        expect.any(Function), // getJobDetailsResolver
        expect.any(Function), // getPrisonerAddressByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })
})
