import joi from 'joi'
import type { Request } from 'express'
import type { ObjectSchema } from 'joi'
import YesNoValue from '../../../enums/YesNoValue'

interface RightToWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function (data: RightToWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select if ${firstName} ${lastName} has the right to work in the UK or not`

  return joi.object({
    rightToWork: joi.string().valid(YesNoValue.Yes, YesNoValue.No).required().messages({
      'any.only': msg,
      'any.required': msg,
    }),
  })
}
