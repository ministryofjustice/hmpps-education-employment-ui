import joi from 'joi'
import type { ObjectSchema } from 'joi'

import ManageDrugsAndAlcoholValue from '../../../../enums/manageDrugsAndAlcoholValue'

interface ManageDrugsAndAlcoholData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: ManageDrugsAndAlcoholData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select whether ${firstName} ${lastName} is able to manage their drug or alcohol dependency or not`

  return joi.object({
    manageDrugsAndAlcohol: joi
      .string()
      .valid(ManageDrugsAndAlcoholValue.ABLE_TO_MANAGE, ManageDrugsAndAlcoholValue.NOT_ABLE_TO_MANAGE)
      .required()
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
