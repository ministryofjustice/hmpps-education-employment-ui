import joi from 'joi'
import type { ObjectSchema } from 'joi'

import alreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'

interface AlreadyInPlaceData {
  prisoner: { firstName: string; lastName: string }
}

export default function (data: AlreadyInPlaceData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select what ${firstName} ${lastName} has in place already`

  return joi.object({
    alreadyInPlace: joi
      .array()
      .required()
      .items(
        joi
          .any()
          .valid(
            alreadyInPlaceValue.BANK_ACCOUNT,
            alreadyInPlaceValue.CV,
            alreadyInPlaceValue.DISCLOSURE_LETTER,
            alreadyInPlaceValue.EMAIL_OR_PHONE,
            alreadyInPlaceValue.HOUSING,
            alreadyInPlaceValue.ID,
            alreadyInPlaceValue.NONE,
          ),
      )
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
