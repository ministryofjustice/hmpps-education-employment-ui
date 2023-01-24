import joi from 'joi'
import type { ObjectSchema } from 'joi'

import ProfileStatus from '../../../enums/profileStatus'

interface NewStatusData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: NewStatusData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select a new status for ${firstName} ${lastName}'s work profile`

  return joi.object({
    newStatus: joi
      .string()
      .valid(
        ProfileStatus.NO_RIGHT_TO_WORK,
        ProfileStatus.READY_TO_WORK,
        ProfileStatus.SUPPORT_DECLINED,
        ProfileStatus.SUPPORT_NEEDED,
      )
      .required()
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
