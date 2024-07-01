import { Request, Response, NextFunction } from 'express'
import FeaturesEnabledHandler from './featuresEnabledHandler'
import config from '../../../config'

describe('featuresEnabledHandler', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should return feature toggles from config', async () => {
    const handler = new FeaturesEnabledHandler()
    await handler.get(req as Request, res as Response, next)

    expect(res.json).toHaveBeenCalledWith({ ...config.featureToggles })
  })
})
