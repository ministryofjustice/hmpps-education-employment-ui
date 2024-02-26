import { Router } from 'express'
import Controller from './workProfileController'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import getAllProfileDataResolver from '../../../middleware/resolvers/getAllProfileDataResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./workProfileController')
jest.mock('../../../middleware/resolvers/getProfileByIdResolver')
jest.mock('../../../middleware/resolvers/getAllProfileDataResolver')

describe('Cohort list routes', () => {
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
    ;(getProfileByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getAllProfileDataResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for new status page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/wr/profile/:id/view/:tab',
      [
        expect.any(Function), // getProfileByIdResolver
        expect.any(Function), // getAllProfileDataResolver
      ],
      expect.any(Function), // controller.get
    )
  })
})
