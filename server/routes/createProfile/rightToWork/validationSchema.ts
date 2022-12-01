import joi from 'joi'
import type { ObjectSchema } from 'joi'

import YesNoValue from '../../../enums/yesNoValue'

interface RightToWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: RightToWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select if ${firstName} ${lastName} has the right to work in the UK or not`

  return joi.object({
    rightToWork: joi.string().valid(YesNoValue.YES, YesNoValue.NO).required().messages({
      'any.only': msg,
      'any.required': msg,
    }),
  })
}
