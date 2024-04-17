import { Router } from 'express'
import Controller from './flaggedJobsController'
import getFlaggedJobsResolver from '../../../middleware/resolvers/getFlaggedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./flaggedJobsController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getFlaggedJobsResolver')
jest.mock('../../../middleware/handleSortMiddleware')

describe('Prisoner list routes', () => {
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
    ;(getFlaggedJobsResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route prisoner list page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/cms/:id/jobs/flagged',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getPrisonerListFlaggedJobsResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route prisoner list page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/cms/:id/jobs/flagged',
      [
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
