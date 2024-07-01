import { Router } from 'express'
import handler from './featuresEnabledHandler'
import routes from './index'

jest.mock('./featuresEnabledHandler')

describe('API get prisoner image routes', () => {
  let router: Router

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    ;(handler as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
    }))
  })

  it('should register GET route get prisoner image', () => {
    routes(router)

    expect(router.get).toHaveBeenCalledWith(
      '/api/features-enabled',
      expect.any(Function), // handler.get
    )
  })
})
