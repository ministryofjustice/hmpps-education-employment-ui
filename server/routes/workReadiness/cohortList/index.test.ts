import { Router } from 'express'
import Controller from './cohortListController'
import getCohortListResolver from '../../../middleware/resolvers/getCohortListResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./cohortListController')
jest.mock('../../../middleware/resolvers/getCohortListResolver')
jest.mock('../../../middleware/handleSortMiddleware')

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
    ;(getCohortListResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for new status page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/wr/cohort-list',
      [
        expect.any(Function), // getCohortListResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for new status page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/wr/cohort-list',
      [
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
