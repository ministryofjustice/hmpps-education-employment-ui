import { plainToClass } from 'class-transformer'
import { RequestHandler } from 'express'
import ProfileViewModel from '../../viewModels/profileViewModel'

export default class WorkProfileController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, tab } = req.params
    const { prisoner, profile } = req.context

    try {
      const data = {
        id,
        prisoner,
        profile: plainToClass(ProfileViewModel, profile),
        tab,
      }

      res.render('pages/workProfile/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
