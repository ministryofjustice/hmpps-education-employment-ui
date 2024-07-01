import { Router } from 'express'
import getNotesResolver from '../../../../middleware/resolvers/getNotesResolver'
import getPrisonerByIdResolver from '../../../../middleware/resolvers/getPrisonerByIdResolver'
import getProfileByIdResolver from '../../../../middleware/resolvers/getProfileByIdResolver'
import { Services } from '../../../../services'
import routes from './index'

// Mock the resolvers
jest.mock('../../../../middleware/resolvers/getNotesResolver')
jest.mock('../../../../middleware/resolvers/getPrisonerByIdResolver')
jest.mock('../../../../middleware/resolvers/getProfileByIdResolver')

describe('Edit action routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    // Create a mock router and services object
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = { prisonerProfileService: {} } as unknown as Services

    // Reset the mock implementation of the resolver functions
    ;(getNotesResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getPrisonerByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(getProfileByIdResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route for edit action page', () => {
    // Call the routes function
    routes(router, services)

    // Check that the expected middleware functions and controller method are called
    expect(router.get).toHaveBeenCalledWith(
      '/wr/profile/actions/:id/edit/:action',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getProfileByIdResolver
        expect.any(Function), // getNotesResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route for edit action page', () => {
    // Call the routes function
    routes(router, services)

    // Check that the expected middleware functions and controller method are called
    expect(router.post).toHaveBeenCalledWith(
      '/wr/profile/actions/:id/edit/:action',
      [
        expect.any(Function), // getPrisonerByIdResolver
        expect.any(Function), // getProfileByIdResolver
        expect.any(Function), // getNotesResolver
        expect.any(Function), // parseCheckBoxValue
      ],
      expect.any(Function), // controller.post
    )
  })
})
