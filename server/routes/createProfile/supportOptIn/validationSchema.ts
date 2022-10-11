import joi from 'joi'
import type { Request } from 'express'
import type { ObjectSchema } from 'joi'
import YesNoValue from '../../../enums/yesNoValue'

interface SupportOptInData {
  prisoner: { firstName: string; lastName: string }
}

export default function (data: SupportOptInData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select if ${firstName} ${lastName} wants support to get work or not`

  return joi.object({
    supportOptIn: joi.string().valid(YesNoValue.Yes, YesNoValue.No).required().messages({
      'any.only': msg,
      'any.required': msg,
    }),
  })
}
