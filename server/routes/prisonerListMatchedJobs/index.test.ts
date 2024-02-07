import { Router } from 'express'
import Controller from './prisonerListMatchedJobsController'
import getPrisonerListMatchedJobsResolver from '../../middleware/resolvers/getPrisonerListMatchedJobsResolver'
import handleSortMiddleware from '../../middleware/handleSortMiddleware'
import { Services } from '../../services'
import routes from './index'

jest.mock('./PrisonerListMatchedJobsController')
jest.mock('../../middleware/resolvers/getPrisonerListMatchedJobsResolver')
jest.mock('../../middleware/handleSortMiddleware')

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
    ;(getPrisonerListMatchedJobsResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for new status page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/cms/prisoners',
      [
        expect.any(Function), // getPrisonerListMatchedJobsResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for new status page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/cms/prisoners',
      [
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
