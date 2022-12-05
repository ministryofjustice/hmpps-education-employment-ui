import { TransformFnParams } from 'class-transformer/types/interfaces/metadata/transform-fn-params.interface'
import { RequestHandler } from 'express'
import { formatDateStringTodMMMM } from '../../utils/utils'

export default class WorkProfileController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, tab } = req.params
    const { prisoner, profile } = req.context

    try {
      const data = {
        id,
        prisoner,
        profile: profile && {
          ...profile,
          modifiedDate:
            profile.modifiedDateTime &&
            formatDateStringTodMMMM({ value: profile.modifiedDateTime } as TransformFnParams),
        },
        tab,
      }

      res.render('pages/workProfile/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}
