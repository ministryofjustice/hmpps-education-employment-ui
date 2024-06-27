import { Router } from 'express'
import Controller from './homePageController'
import getUserRolesResolver from '../../middleware/resolvers/getUserRolesResolver'
import checkCmsEnabledHomepage from '../../middleware/checkCmsEnabledHomepage'
import { Services } from '../../services'
import routes from './index'

jest.mock('./homePageController')
jest.mock('../../middleware/resolvers/getUserRolesResolver')
jest.mock('../../middleware/checkCmsEnabledHomepage')

describe('Candidate matching routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn() } as unknown as Router
    services = {
      homePageService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
    }))
    ;(getUserRolesResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(checkCmsEnabledHomepage as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for home page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/',
      [
        expect.any(Function), // checkCmsEnabledHomepage
        expect.any(Function), // getUserRolesResolver
      ],
      expect.any(Function), // controller.get
    )
  })
})
