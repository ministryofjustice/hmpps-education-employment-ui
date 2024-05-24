import { Router } from 'express'
import Controller from './manageApplicationController'
import getPrisonerByIdResolver from '../../../middleware/resolvers/getPrisonerByIdResolver'
import getJobDetailsResolver from '../../../middleware/resolvers/getJobDetailsResolver'
import getApplicationProgressResolver from '../../../middleware/resolvers/getApplicationProgressResolver'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./manageApplicationController')
jest.mock('../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../middleware/resolvers/getJobDetailsResolver')
jest.mock('../../../middleware/resolvers/getApplicationProgressResolver')

describe('Right to work routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerProfileService: {},
      prisonerSearchService: {},
      jobService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getJobDetailsResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getApplicationProgressResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for page', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/cms/:id/job/:jobId/application/:mode',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getJobDetailsResolver
        expect.any(Function), // getApplicationProgressResolver
      ],
      expect.any(Function), // controller.get
    )
  })
})
