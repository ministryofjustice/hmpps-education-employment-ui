import { Router } from 'express'
import Controller from './newStatusController'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./newStatusController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getProfileByIdResolver')

describe('New status routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerProfileService: {},
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getProfileByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for new status page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/profile/change-status/:id/new-status',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getProfileByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for new status page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/profile/change-status/:id/new-status',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getProfileByIdResolver
      ],
      expect.any(Function), // controller.post
    )
  })
})
