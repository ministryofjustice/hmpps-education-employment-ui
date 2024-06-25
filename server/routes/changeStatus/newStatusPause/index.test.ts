import { Router } from 'express'
import NewStatusPauseController from './newStatusPauseController'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./newStatusPauseController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')

describe('New status pause routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(NewStatusPauseController as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for new status page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/profile/change-status/:id/pause',
      [
        expect.any(Function), // getPrisonerByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for new status page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/profile/change-status/:id/pause',
      [
        expect.any(Function), // getPrisonerByIdResolver
      ],
      expect.any(Function), // controller.post
    )
  })
})
