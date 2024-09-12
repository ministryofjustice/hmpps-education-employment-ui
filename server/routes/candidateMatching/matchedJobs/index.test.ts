import { Router } from 'express'
import Controller from './matchedJobsController'
import getPrisonerListMatchedJobsResolver from '../../../middleware/resolvers/getMatchedJobsResolver'
import handleSortMiddleware from '../../../middleware/handleSortMiddleware'
import getProfileByIdResolver from '../../../middleware/resolvers/getProfileByIdResolver'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import parseCheckBoxValue from '../../../middleware/parseCheckBoxValue'
import getPrisonerAddressByIdResolver from '../../../middleware/resolvers/getPrisonerAddressByIdResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./matchedJobsController')
jest.mock('../../../middleware/resolvers/getProfileByIdResolver')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getMatchedJobsResolver')
jest.mock('../../../middleware/resolvers/getPrisonerAddressByIdResolver')
jest.mock('../../../middleware/handleSortMiddleware')
jest.mock('../../../middleware/parseCheckBoxValue')

describe('Matched jobs routes', () => {
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
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(handleSortMiddleware as jest.Mock).mockImplementation(() => jest.fn())
    ;(getProfileByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(parseCheckBoxValue as jest.Mock).mockImplementation(() => jest.fn())
    ;(getPrisonerAddressByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route prisoner list page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/mjma/:id/jobs/matched',
      [
        expect.any(Function), // getProfileByIdResolver
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getPrisonerListMatchedJobsResolver
        expect.any(Function), // getPrisonerAddressByIdResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route prisoner list page', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/mjma/:id/jobs/matched',
      [
        expect.any(Function), // handleSortMiddleware
        expect.any(Function), // parseCheckBoxValue
        expect.any(Function), // parseCheckBoxValue
      ],
      expect.any(Function), // controller.post
    )
  })
})
