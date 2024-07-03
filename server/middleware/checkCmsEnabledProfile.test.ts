import { Request, Response, NextFunction } from 'express'
import checkCmsEnabledProfile from './checkCmsEnabledProfile'
import config from '../config'

// Mock config and addressLookup
jest.mock('../config', () => ({
  featureToggles: {
    candidateMatchingEnabled: false,
  },
}))

describe('checkCmsEnabledProfile Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {
      params: {
        module: 'cms',
        id: '123',
        tab: 'info',
      },
    }

    res = {
      redirect: jest.fn(),
    }

    next = jest.fn()
  })

  it('should redirect if module is "cms" and candidateMatchingEnabled is false', async () => {
    await checkCmsEnabledProfile(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/wr/profile/123/view/info')
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next if module is not "cms"', async () => {
    req.params.module = 'other'

    await checkCmsEnabledProfile(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should call next if candidateMatchingEnabled is true', async () => {
    ;(config.featureToggles.candidateMatchingEnabled as boolean) = true

    await checkCmsEnabledProfile(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
