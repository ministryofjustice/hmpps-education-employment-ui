import { Router } from 'express'
import Controller from './typeOfWorkController'
import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import parseCheckBoxValue from '../../../../middleware/parseCheckBoxValue'
import { Services } from '../../../../services'
import routes from './index'

jest.mock('./typeOfWorkController')
jest.mock('../../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../../middleware/resolvers/getProfileByIdResolver')
jest.mock('../../../../middleware/parseCheckBoxValue')

describe('Right to work routes', () => {
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
    ;(parseCheckBoxValue as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/wr/profile/create/:id/type-of-work/:mode',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getProfileByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/wr/profile/create/:id/type-of-work/:mode',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getProfileByIdResolver
        expect.any(Function), // parseCheckBoxValue
      ],
      expect.any(Function), // controller.post
    )
  })
})
