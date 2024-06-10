import { Router } from 'express'
import Controller from './prisonerListApplicationsController'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./prisonerListApplicationsController')
jest.mock('../../../middleware/handleSortMiddleware')

describe('Prisoner list applications routes', () => {
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
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route prisoner list page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/cms/applications',
      [],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route prisoner list page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/cms/applications',
      [
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
