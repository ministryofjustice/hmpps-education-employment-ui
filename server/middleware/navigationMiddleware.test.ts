import { Request, Response, NextFunction } from 'express'
import navigationMiddleware from './navigationMiddleware'
import { navigationService } from '../services/navigationService'

jest.mock('../services/navigationService', () => ({
  navigationService: {
    getBackLink: jest.fn(),
    appendFromParam: jest.fn(),
  },
}))

describe('navigationMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {
      originalUrl: '/current/page',
    }

    res = {
      locals: {},
    }

    next = jest.fn()

    jest.clearAllMocks()
  })

  it('sets res.locals.backLink using navigationService', () => {
    ;(navigationService.getBackLink as jest.Mock).mockReturnValue('/previous')

    navigationMiddleware(req as Request, res as Response, next)

    expect(navigationService.getBackLink).toHaveBeenCalledWith('/current/page')
    expect(res.locals.backLink).toBe('/previous')
  })

  it('adds withFrom helper to res.locals', () => {
    ;(navigationService.getBackLink as jest.Mock).mockReturnValue('/previous')
    ;(navigationService.appendFromParam as jest.Mock).mockReturnValue('/target?from=encrypted')

    navigationMiddleware(req as Request, res as Response, next)

    const result = res.locals.withFrom('/target')

    expect(navigationService.appendFromParam).toHaveBeenCalledWith('/target', '/current/page')
    expect(result).toBe('/target?from=encrypted')
  })

  it('calls next()', () => {
    ;(navigationService.getBackLink as jest.Mock).mockReturnValue('/previous')

    navigationMiddleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })
})
