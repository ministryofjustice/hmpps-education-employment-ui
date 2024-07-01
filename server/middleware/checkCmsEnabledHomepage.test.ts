import { Request, Response, NextFunction } from 'express'
import checkCmsEnabledHomepage from './checkCmsEnabledHomepage'
import config from '../config'

// Mock config and addressLookup
jest.mock('../config', () => ({
  featureToggles: {
    candidateMatchingEnabled: false,
  },
}))

describe('checkCmsEnabledHomepage Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}

    res = {
      redirect: jest.fn(),
    }

    next = jest.fn()
  })

  it('should redirect if candidateMatchingEnabled is false', async () => {
    await checkCmsEnabledHomepage(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/wr/cohort-list?sort=releaseDate&order=descending')
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next if candidateMatchingEnabled is true', async () => {
    ;(config.featureToggles.candidateMatchingEnabled as boolean) = true

    await checkCmsEnabledHomepage(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
