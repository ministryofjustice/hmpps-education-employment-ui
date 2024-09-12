import { Router } from 'express'
import Controller from './archivedJobsController'
import getArchivedJobsResolver from '../../../middleware/resolvers/getArchivedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./archivedJobsController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getArchivedJobsResolver')
jest.mock('../../../middleware/handleSortMiddleware')

describe('Archived jobs routes', () => {
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
    ;(getArchivedJobsResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route prisoner list page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/mjma/:id/jobs/archived',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getPrisonerListArchivedJobsResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route prisoner list page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/mjma/:id/jobs/archived',
      [
        expect.any(Function), // handleSortMiddleware
      ],
      expect.any(Function), // controller.post
    )
  })
})
