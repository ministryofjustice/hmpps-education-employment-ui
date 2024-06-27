import { RequestHandler } from 'express'
import config from '../../../config'

export default class FeaturesEnabledHandler {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      res.json(config.featureToggles)
    } catch (error) {
      next(error)
    }
  }
}
