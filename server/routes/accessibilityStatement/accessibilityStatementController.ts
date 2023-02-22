import { RequestHandler } from 'express'

export default class NewStatusPauseController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    res.render('pages/accessibilityStatement/index')
  }
}
