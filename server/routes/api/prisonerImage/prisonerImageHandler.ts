import { RequestHandler } from 'express'

import PrisonService from '../../../services/prisonService'

export default class PrisonerImageHandler {
  constructor(private readonly prisonService: PrisonService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Get image from api
      const image = await this.prisonService.getPrisonerImage(username, id)

      if (image) {
        // Send image to client
        res.set('Content-type', 'image/jpeg')
        image.pipe(res)
        return
      }

      res.status(404).send('Not found')
    } catch (error) {
      next(error)
    }
  }
}
