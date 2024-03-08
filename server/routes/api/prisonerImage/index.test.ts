import { Router } from 'express'
import handler from './prisonerImageHandler'
import { Services } from '../../../services'
import routes from './index'

jest.mock('./prisonerImageHandler')

describe('API get prisoner image routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonService: {},
    } as unknown as Services
    ;(handler as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
    }))
  })

  it('should register GET route get prisoner image', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/api/prisoner-image/:id',
      expect.any(Function), // handler.get
    )
  })
})
