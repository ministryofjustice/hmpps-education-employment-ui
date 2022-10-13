import joi from 'joi'
import type { ObjectSchema } from 'joi'

import YesNoValue from '../../../enums/yesNoValue'

interface SupportDeclinedReasonData {
  prisoner: { firstName: string; lastName: string }
}

export default function (data: SupportDeclinedReasonData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the reason why ${firstName} ${lastName} does not want support`
  const msgOther = `Enter the reason why ${firstName} ${lastName} does not want support`

  return joi.object({
    supportDeclinedOther: joi.when('supportDeclinedReason', {
      is: joi.array().items(joi.any().valid('OTHER').required()),
      then: joi.string().required(),
    }),
    supportDeclinedReason: joi.array().required().messages({
      'any.required': msg,
    }),
  })
}
